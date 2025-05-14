import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: SampleDatePickerComponent ;
  let fixture: ComponentFixture<SampleDatePickerComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SampleDatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleDatePickerComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
