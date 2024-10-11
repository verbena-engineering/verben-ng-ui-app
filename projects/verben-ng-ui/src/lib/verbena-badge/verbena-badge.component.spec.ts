import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbenaBadgeComponent } from './verbena-badge.component';

describe('VerbenaBadgeComponent', () => {
  let component: VerbenaBadgeComponent;
  let fixture: ComponentFixture<VerbenaBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaBadgeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbenaBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
