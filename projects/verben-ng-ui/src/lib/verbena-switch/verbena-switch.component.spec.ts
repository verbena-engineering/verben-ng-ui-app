import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbenaSwitchComponent } from './verbena-switch.component';

describe('VerbenaSwitchComponent', () => {
  let component: VerbenaSwitchComponent;
  let fixture: ComponentFixture<VerbenaSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaSwitchComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbenaSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
