import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipSampleComponent } from './tooltip-sample.component';

describe('TooltipSampleComponent', () => {
  let component: TooltipSampleComponent;
  let fixture: ComponentFixture<TooltipSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TooltipSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TooltipSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
