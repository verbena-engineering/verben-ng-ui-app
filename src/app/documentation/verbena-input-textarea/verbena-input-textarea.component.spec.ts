import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenaInputTextareaComponent } from './verbena-input-textarea.component';

describe('VerbenaInputTextareaComponent', () => {
  let component: VerbenaInputTextareaComponent;
  let fixture: ComponentFixture<VerbenaInputTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaInputTextareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenaInputTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
