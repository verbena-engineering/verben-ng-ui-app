import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbenaButtonComponent } from './verbena-button.component';

describe('VerbenaButtonComponent', () => {
  let component: VerbenaButtonComponent;
  let fixture: ComponentFixture<VerbenaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbenaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
