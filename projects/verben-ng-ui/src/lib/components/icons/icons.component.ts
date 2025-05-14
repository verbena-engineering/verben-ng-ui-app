import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'lib-icon',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css'],
})
export class IconsComponent implements OnInit {
  @Input() iconName: string = '';
  svgContent: SafeHtml = '';

  constructor(
    private iconService: IconService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.iconService.getIcon(this.iconName).subscribe((svg) => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }
}
