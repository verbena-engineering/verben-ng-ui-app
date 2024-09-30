import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'verben-svg',
  standalone: true,
  imports: [],
  template: '<span [innerHTML]="svgContent"></span>',
  styleUrl: './svg.component.css'
})

export class SvgComponent implements OnInit {
  @Input() icon: string = '';
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() color: string = 'black';

  svgContent: SafeHtml = '';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadSvgIcon(this.icon);
  }

  loadSvgIcon(iconName: string): void {
    this.http.get(`assets/icons/${iconName}.svg`, { responseType: 'text' })
      .subscribe((svgContent: string) => {
        this.updateSvgContent(svgContent);
      });
  }

  private updateSvgContent(svgContent: string): void {
    const updatedSvg = svgContent
      .replace(/width="\d+"/g, `width="${this.width}"`)
      .replace(/height="\d+"/g, `height="${this.height}"`)
      .replace(/fill="[^"]*"/g, `fill="${this.color}"`);

    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(updatedSvg);
  }
}

