import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbenTimePickerComponent } from './verben-time-picker.component';

describe('VerbenTimePickerComponent', () => {
  let component: VerbenTimePickerComponent;
  let fixture: ComponentFixture<VerbenTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerbenTimePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set hour correctly', () => {
    component.setHour(5);
    expect(component.hours).toBe(5);
  });

  it('should toggle meridian', () => {
    component.toggleMeridian();
    expect(component.meridian).toBe('PM');
    component.toggleMeridian();
    expect(component.meridian).toBe('AM');
  });
});
