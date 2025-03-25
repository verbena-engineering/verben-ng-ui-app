import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenaTabComponent } from './verbena-tab.component';

describe('VerbenaTabComponent', () => {
  let component: VerbenaTabComponent;
  let fixture: ComponentFixture<VerbenaTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbenaTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
