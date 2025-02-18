import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftCardDataViewComponent } from './left-card-data-view.component';

describe('LeftCardDataViewComponent', () => {
  let component: LeftCardDataViewComponent;
  let fixture: ComponentFixture<LeftCardDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftCardDataViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftCardDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
