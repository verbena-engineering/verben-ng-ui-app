import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenaComponentComponent } from './verbena-component.component';

describe('VerbenaComponentComponent', () => {
  let component: VerbenaComponentComponent;
  let fixture: ComponentFixture<VerbenaComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
