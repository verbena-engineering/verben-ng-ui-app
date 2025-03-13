import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { VerbenaTextareaComponent } from './verbena-textarea.component';

describe('VerbenaTextareaComponent', () => {
  let component: VerbenaTextareaComponent;
  let fixture: ComponentFixture<VerbenaTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerbenaTextareaComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbenaTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required field', () => {
    component.required = true;
    component.value = '';
    component.validate();
    expect(component.errorMessage).toBe('This field is required');
  });
});
