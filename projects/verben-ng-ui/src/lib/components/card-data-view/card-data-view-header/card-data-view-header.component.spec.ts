import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataViewHeaderComponent } from './card-data-view-header.component';

describe('CardDataViewHeaderComponent', () => {
  let component: CardDataViewHeaderComponent;
  let fixture: ComponentFixture<CardDataViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDataViewHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDataViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
