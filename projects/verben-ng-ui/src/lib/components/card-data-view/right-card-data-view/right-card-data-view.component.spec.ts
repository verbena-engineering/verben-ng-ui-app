import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightCardDataViewComponent } from './right-card-data-view.component';

describe('RightCardDataViewComponent', () => {
  let component: RightCardDataViewComponent;
  let fixture: ComponentFixture<RightCardDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightCardDataViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightCardDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
