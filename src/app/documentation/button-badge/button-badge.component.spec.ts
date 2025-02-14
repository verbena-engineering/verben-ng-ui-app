import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonBadgeComponent } from './button-badge.component';

describe('ButtonBadgeComponent', () => {
  let component: ButtonBadgeComponent;
  let fixture: ComponentFixture<ButtonBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
