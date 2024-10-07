import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataViewComponent } from './cdv.component';

describe('CardDataViewComponent', () => {
  let component: CardDataViewComponent;
  let fixture: ComponentFixture<CardDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardDataViewComponent]
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
