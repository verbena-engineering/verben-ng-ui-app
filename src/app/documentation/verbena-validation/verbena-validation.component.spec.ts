import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenaValidationComponent } from './verbena-validation.component';

describe('VerbenaValidationComponent', () => {
  let component: VerbenaValidationComponent;
  let fixture: ComponentFixture<VerbenaValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenaValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
