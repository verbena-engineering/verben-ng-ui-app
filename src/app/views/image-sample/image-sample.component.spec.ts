import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSampleComponent } from './image-sample.component';

describe('ImageSampleComponent', () => {
  let component: ImageSampleComponent;
  let fixture: ComponentFixture<ImageSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
