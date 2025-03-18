import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenaIconComponent } from './verbena-icon.component';

describe('GoogleIconComponent', () => {
  let component: VerbenaIconComponent;
  let fixture: ComponentFixture<VerbenaIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbenaIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenaIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
