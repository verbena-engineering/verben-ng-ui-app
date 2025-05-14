import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataViewComponent } from './card-data-view.component';

describe('CardDataViewComponent', () => {
  let component: CardDataViewComponent;
  let fixture: ComponentFixture<CardDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDataViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
