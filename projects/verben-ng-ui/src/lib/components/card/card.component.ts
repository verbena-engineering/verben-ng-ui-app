import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, AfterContentInit, Input } from '@angular/core';

@Component({
  selector: 'verben-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements AfterContentInit {
  hasHeader = false;
  hasFooter = false;
  hasBody = false;
  @Input() pd = '10px';
  @Input() mg = '0px';
  @Input() height?:string ;
  @Input() width?:string ;
  @Input() textColor?:string ;
  @Input() bgColor?:string ;
  @Input() border?:string ;
  @Input() borderRadius?:string ;
  @Input() disabled:boolean=false ;
  @Input() aspectRatio?:number ;
  @ContentChild('card-header', { static: false }) cardHeader: ElementRef | undefined;
  @ContentChild('card-body', { static: false }) cardBody: ElementRef | undefined;
  @ContentChild('card-footer', { static: false }) cardFooter: ElementRef | undefined;

  ngAfterContentInit() {
    this.hasHeader = !this.cardHeader;
    this.hasBody = !this.cardBody;
    this.hasFooter = !this.cardFooter;
  }
}