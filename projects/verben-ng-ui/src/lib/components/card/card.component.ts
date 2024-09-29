import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'verben-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements AfterContentInit {
  hasHeader = false;
  hasFooter = false;
  hasBody = false;

  @ContentChild('card-header', { static: false }) cardHeader: ElementRef | undefined;
  @ContentChild('card-body', { static: false }) cardBody: ElementRef | undefined;
  @ContentChild('card-footer', { static: false }) cardFooter: ElementRef | undefined;

  ngAfterContentInit() {
    this.hasHeader = !this.cardHeader;
    this.hasBody = !this.cardBody;
    this.hasFooter = !this.cardFooter;
  }
}