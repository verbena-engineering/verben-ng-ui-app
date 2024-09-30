import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'verben-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})

export class ImageComponent implements OnInit, AfterViewInit {
  @Input() url: string = '';
  @Input() placeholder: string = 'assets/placeholder.png';
  @Input() lazyLoad: boolean = false;
  @Input() width: string = '100%'; 
  @Input() height: string = 'auto'; 

  isLoaded: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.lazyLoad) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img: HTMLImageElement = this.el.nativeElement.querySelector('img[data-src]');
            img.src = img.getAttribute('data-src')!;
            this.isLoaded = true;
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(this.el.nativeElement);
    }else {    
      const img: HTMLImageElement = this.el.nativeElement.querySelector('img');
      img.onload = () => {
        this.isLoaded = true; 
      };
    }
  }
}



