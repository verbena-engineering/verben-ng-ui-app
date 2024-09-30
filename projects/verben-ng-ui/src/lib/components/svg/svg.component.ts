import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'verben-svg',
  standalone: true,
  imports: [],
  template: '<span #svgContainer></span>',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  @Input() icon: string = '';
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() fill: string = '';
  @Input() stroke: string = '';

  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadSvgIcon(this.icon);
  }

  ngOnChanges(): void {
    this.loadSvgIcon(this.icon);
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

    svgElement.setAttribute('width', this.width.toString());
    svgElement.setAttribute('height', this.height.toString());

    const paths = svgElement.querySelectorAll('path');
    paths.forEach(path => {
      path.setAttribute('fill', this.fill);
      path.setAttribute('stroke', this.stroke);
    });

    const svgContainerEl = this.svgContainer.nativeElement;
    svgContainerEl.innerHTML = '';
    svgContainerEl.appendChild(svgElement);
  }
}
