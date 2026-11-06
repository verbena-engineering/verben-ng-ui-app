import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { LIB_ICON_SETS } from './lib-icon-manifest';

@Component({
  selector: 'verben-svg',
  template: '<span #svgContainer></span>',
  styleUrls: ['./svg.component.css'],
})
export class SvgComponent implements OnInit, OnChanges, OnDestroy {
  private static readonly svgCache = new Map<string, Observable<string | null>>();
  private static libIconsStatus: 'unknown' | 'available' | 'unavailable' = 'unknown';
  private static libIconsProbe$: Observable<boolean> | null = null;

  @Input() icon: string = '';
  @Input() width: number = 24;
  @Input() height: number = 24;
  color: string = '';
  @Input() fill: string = '';
  @Input() stroke: string = '';
  @Input() type: 'default' | 'outline' | 'solid' = 'default';

  @Input() size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  private loadedKey: string = '';
  private rawSvgContent: string | null = null;
  private sub?: Subscription;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.color = this.fill.length > 0 ? this.fill : this.stroke;
    if (!this.loadedKey && this.icon) {
      this.loadSvgIcon(this.icon);
    }
  }

  ngOnChanges(): void {
    this.color = this.fill.length > 0 ? this.fill : this.stroke;
    const trimmed = this.icon?.trim() || '';
    const nextKey = trimmed ? `${this.type}:${trimmed}` : '';

    if (nextKey !== this.loadedKey) {
      this.loadSvgIcon(this.icon);
    } else if (this.rawSvgContent) {
      try {
        this.updateSvg(this.rawSvgContent);
      } catch (err: any) {
        // Ignore DOM parse errors
      }
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private getIconDimensions(): { width: number; height: number } {
    let width = this.width;
    let height = this.height;

    if (this.size) {
      switch (this.size) {
        case 'sm':
          width = height = 16;
          break;
        case 'md':
          width = height = 24;
          break;
        case 'lg':
          width = height = 32;
          break;
        case 'xl':
          width = height = 48;
          break;
        case '2xl':
          width = height = 52;
          break;
        case '3xl':
          width = height = 64;
          break;
        case '4xl':
          width = height = 80;
          break;
        default:
          width = height = 16;
          break;
      }
    }

    return { width, height };
  }

  loadSvgIcon(iconName: string): void {
    const trimmed = iconName?.trim() || '';
    if (!trimmed) {
      this.loadedKey = '';
      this.rawSvgContent = null;
      this.sub?.unsubscribe();
      if (this.svgContainer?.nativeElement) {
        this.svgContainer.nativeElement.innerHTML = '';
      }
      return;
    }

    const iconType = this.type || 'default';
    this.loadedKey = `${iconType}:${trimmed}`;
    this.sub?.unsubscribe();

    this.sub = this.resolveSvg$(trimmed, iconType).subscribe((svgContent) => {
      if (svgContent) {
        this.rawSvgContent = svgContent;
        try {
          this.updateSvg(svgContent);
        } catch (err: any) {
          // console.log({ Error: err });
        }
      }
    });
  }

  private resolveSvg$(
    iconName: string,
    type: 'default' | 'outline' | 'solid'
  ): Observable<string | null> {
    const cacheKey = `${type}:${iconName}`;
    const existing = SvgComponent.svgCache.get(cacheKey);
    if (existing) {
      return existing;
    }

    const inRequestedSet = LIB_ICON_SETS[type]?.has(iconName) ?? false;
    const inDefaultSet = LIB_ICON_SETS.default.has(iconName);
    const libFolder: 'default' | 'outline' | 'solid' | null = inRequestedSet
      ? type
      : inDefaultSet
      ? 'default'
      : null;

    let request$: Observable<string | null>;

    if (!libFolder || SvgComponent.libIconsStatus === 'unavailable') {
      // Icon is not in the library's built-in set (custom app icon) or lib-icons is not mounted
      request$ = this.fetchFromAppAssets$(iconName);
    } else if (SvgComponent.libIconsStatus === 'available') {
      request$ = this.fetchFromLibAssets$(libFolder, iconName);
    } else {
      // First library icon requested: probe `assets/lib-icons` once and share status across concurrent icons
      if (!SvgComponent.libIconsProbe$) {
        const firstTry$ = this.http
          .get(`assets/lib-icons/${libFolder}/${iconName}.svg`, {
            responseType: 'text',
          })
          .pipe(
            map((svg) => (svg && svg.includes('<svg') ? svg : null)),
            catchError(() => of(null)),
            shareReplay({ bufferSize: 1, refCount: false })
          );

        SvgComponent.libIconsProbe$ = firstTry$.pipe(
          map((svg) => {
            const available = svg !== null;
            SvgComponent.libIconsStatus = available ? 'available' : 'unavailable';
            return available;
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );

        request$ = firstTry$.pipe(
          switchMap((svg) => {
            if (svg !== null) {
              SvgComponent.libIconsStatus = 'available';
              return of(svg);
            }
            SvgComponent.libIconsStatus = 'unavailable';
            return this.fetchFromAppAssets$(iconName);
          })
        );
      } else {
        request$ = SvgComponent.libIconsProbe$.pipe(
          switchMap((available) =>
            available
              ? this.fetchFromLibAssets$(libFolder, iconName)
              : this.fetchFromAppAssets$(iconName)
          )
        );
      }
    }

    const shared$ = request$.pipe(shareReplay({ bufferSize: 1, refCount: false }));
    SvgComponent.svgCache.set(cacheKey, shared$);
    return shared$;
  }

  private fetchFromLibAssets$(
    folder: 'default' | 'outline' | 'solid',
    iconName: string
  ): Observable<string | null> {
    return this.http
      .get(`assets/lib-icons/${folder}/${iconName}.svg`, {
        responseType: 'text',
      })
      .pipe(
        switchMap((svgContent) => {
          if (svgContent && svgContent.includes('<svg')) {
            return of(svgContent);
          }
          return this.fetchFromAppAssets$(iconName);
        }),
        catchError(() => this.fetchFromAppAssets$(iconName))
      );
  }

  private fetchFromAppAssets$(iconName: string): Observable<string | null> {
    return this.http
      .get(`assets/icons/${iconName}.svg`, { responseType: 'text' })
      .pipe(
        map((svgContent) =>
          svgContent && svgContent.includes('<svg') ? svgContent : null
        ),
        catchError(() => of(null))
      );
  }

  private updateSvg(svgContent: string): void {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    const { width, height } = this.getIconDimensions();

    svgElement.setAttribute('width', width.toString());
    svgElement.setAttribute('height', height.toString());

    const elementsToUpdate = [
      'path',
      'circle',
      'line',
      'rect',
      'polygon',
      'polyline',
      'ellipse',
    ];

    elementsToUpdate.forEach((tag) => {
      const elements = svgElement.querySelectorAll(tag);
      elements.forEach((element) => {
        const hasStroke =
          element.hasAttribute('stroke') &&
          element.getAttribute('stroke') !== 'none';
        const hasFill =
          element.hasAttribute('fill') &&
          element.getAttribute('fill') !== 'none';

        // Set as inline style (not just the presentation attribute) so theme
        // tokens like `var(--vbn-color-error)` resolve — CSS custom properties
        // are not honored in SVG presentation attributes.
        if (this.color && hasFill) {
          element.setAttribute('fill', this.color);
          (element as HTMLElement).style.fill = this.color;
        }
        if (this.color && hasStroke) {
          element.setAttribute('stroke', this.color);
          (element as HTMLElement).style.stroke = this.color;
        }
      });
    });

    const masks = svgElement.querySelectorAll('mask');
    masks.forEach((mask, index) => {
      const newMaskId = `mask_${this.icon}_${index}`;
      mask.setAttribute('id', newMaskId);

      const maskReferences = svgElement.querySelectorAll(
        `[mask="url(#${mask.id})"]`
      );
      maskReferences.forEach((ref) => {
        ref.setAttribute('mask', `url(#${newMaskId})`);
      });
    });

    const svgContainerEl = this.svgContainer.nativeElement;
    svgContainerEl.innerHTML = '';
    svgContainerEl.appendChild(svgElement);
  }
}
