import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataViewFooterComponent } from './card-data-view-footer.component';

describe('CardDataViewFooterComponent', () => {
  let component: CardDataViewFooterComponent;
  let fixture: ComponentFixture<CardDataViewFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDataViewFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDataViewFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
