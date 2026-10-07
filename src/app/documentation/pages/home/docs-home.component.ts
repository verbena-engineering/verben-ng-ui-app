import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COMPONENT_DOCS, UNSTABLE_DOCS } from '../../docs-registry';

/** Landing page: intro + a grid of cards with a small preview of each component */
@Component({
  selector: 'docs-home',
  templateUrl: './docs-home.component.html',
})
export class DocsHomeComponent implements OnInit {
  components = COMPONENT_DOCS;
  unstable = UNSTABLE_DOCS;

  // Sample values so the thumbnails look "in use"
  previewDate = new Date(2026, 9, 14);
  previewTime = new Date(2026, 9, 14, 9, 30);
  fruits = ['Apple', 'Banana', 'Mango'];
  tags = ['Angular', 'Design'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Header "Components" link points at #components on this page
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() =>
          document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' }),
        );
      }
    });
  }
}
