import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  OnChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'verben-svg',
  template: '<span #svgContainer></span>',
  styleUrls: ['./svg.component.css'],
})
export class SvgComponent implements OnInit, OnChanges {
  @Input() icon: string = '';
  @Input() width: number = 24;
  @Input() height: number = 24;
  color: string = '';
  @Input() fill: string = '';
  @Input() stroke: string = '';
  @Input() type: 'default' | 'outline' | 'solid' = 'default';

  @Input() size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.color = this.fill.length > 0 ? this.fill : this.stroke;
    this.loadSvgIcon(this.icon);
  }

  ngOnChanges(): void {
    this.loadSvgIcon(this.icon);
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
    this.http
      .get(`assets/lib-icons/${this.type}/${iconName}.svg`, {
        responseType: 'text',
      })
      .subscribe(
        (svgContent: string | null) => {
          if (svgContent && svgContent.startsWith('<svg')) {
            try {
              this.updateSvg(svgContent);
            } catch (err: any) {
              console.log({ Error: err });
            }
          } else {
            // If response is not a valid SVG, try loading from project assets
            this.fallbackLoad(iconName);
          }
        },
        (error) => {
          this.fallbackLoad(iconName);
        }
      );
  }

  private fallbackLoad(iconName: string): void {
    this.http
      .get(`assets/icons/${iconName}.svg`, { responseType: 'text' })
      .subscribe(
        (svgContent: string | null) => {
          if (svgContent && svgContent.startsWith('<svg')) {
            try {
              this.updateSvg(svgContent);
            } catch (err: any) {
              console.log({ Error: err });
            }
          } else {
            console.error(`Invalid SVG response for ${iconName}`);
          }
        },
        (error) => {
          console.error(`Error loading SVG icon: ${error}`);
        }
      );
  }

  // loadSvgIcon(iconName: string): void {
  //   this.http
  //     .get(`assets/lib-icons/${this.type}/${iconName}.svg`, {
  //       responseType: 'text',
  //     })
  //     .subscribe(
  //       (svgContent: string | null) => {
  //         //console.log({SvgContent: svgContent});
  //         if (svgContent) {
  //           try {
  //             this.updateSvg(svgContent);
  //           } catch (err: any) {
  //             console.log({ Error: err });
  //           }
  //         }
  //       },
  //       (error) => {
  //         this.http
  //           .get(`assets/icons/${iconName}.svg`, { responseType: 'text' })
  //           .subscribe(
  //             (svgContent: string | null) => {
  //               //console.log({SvgContent: svgContent});
  //               if (svgContent) {
  //                 try {
  //                   this.updateSvg(svgContent);
  //                 } catch (err: any) {
  //                   console.log({ Error: err });
  //                 }
  //               }
  //             },
  //             (error) => {
  //               console.error(`Error loading SVG icon: ${error}`);
  //             }
  //           );
  //       }
  //     );
  // }

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

        if (this.icon == 'add') {
          console.log({
            Element: element,
            hasStroke: hasStroke,
            hasFill: hasFill,
            Stroke: element.getAttribute('stroke'),
            Fill: element.getAttribute('fill'),
          });
        }
        if (this.color && hasFill) {
          element.setAttribute('fill', this.color);
        }
        if (this.color && hasStroke) {
          element.setAttribute('stroke', this.color);
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
