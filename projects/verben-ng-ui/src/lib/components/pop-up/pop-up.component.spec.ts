import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenPopUpComponent } from './pop-up.component';

describe('popupComponent', () => {
  let component: VerbenPopUpComponent;
  let fixture: ComponentFixture<VerbenPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbenPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
