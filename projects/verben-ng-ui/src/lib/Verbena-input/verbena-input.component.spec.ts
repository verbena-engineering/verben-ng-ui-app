import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbenaInputComponent } from './verbena-input.component';
import { FormsModule } from '@angular/forms';

describe('VerbenaInputComponent', () => {
  let component: VerbenaInputComponent;
  let fixture: ComponentFixture<VerbenaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaInputComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbenaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
