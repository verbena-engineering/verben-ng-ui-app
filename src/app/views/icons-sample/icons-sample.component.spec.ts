import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsSampleComponent } from './icons-sample.component';

describe('IconsSampleComponent', () => {
  let component: IconsSampleComponent;
  let fixture: ComponentFixture<IconsSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconsSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconsSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
