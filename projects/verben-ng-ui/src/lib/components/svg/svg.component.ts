import { Component, Input, OnInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'verben-svg',
  template: '<span #svgContainer></span>',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit, OnChanges {
  @Input() icon: string = '';
  @Input() width: number = 24;  
  @Input() height: number = 24; 
  @Input() fill: string = '';
  @Input() stroke: string = '';

  @Input() size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'; 

  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
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
    this.http.get(`assets/icons/${iconName}.svg`, { responseType: 'text' })
      .subscribe((svgContent: string) => {
        this.updateSvg(svgContent);
      }, (error) => {
        console.error(`Error loading SVG icon: ${error}`);
      });
  }

  private updateSvg(svgContent: string): void {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    const { width, height } = this.getIconDimensions();

    svgElement.setAttribute('width', width.toString());
    svgElement.setAttribute('height', height.toString());

    const elementsToUpdate = ['path', 'circle', 'line', 'rect', 'polygon', 'polyline', 'ellipse'];

    elementsToUpdate.forEach(tag => {
      const elements = svgElement.querySelectorAll(tag);
      elements.forEach(element => {
        if (this.fill) {
          element.setAttribute('fill', this.fill);
        }
        if (this.stroke) {
          element.setAttribute('stroke', this.stroke);
        }
      });
    });

    const svgContainerEl = this.svgContainer.nativeElement;
    svgContainerEl.innerHTML = '';
    svgContainerEl.appendChild(svgElement);
  }
}
