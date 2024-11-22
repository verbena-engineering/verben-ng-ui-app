import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftCardDataComponent } from './left-card-data.component';

describe('LeftCardDataComponent', () => {
  let component: LeftCardDataComponent;
  let fixture: ComponentFixture<LeftCardDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftCardDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftCardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
