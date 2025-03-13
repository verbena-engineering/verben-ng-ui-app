import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataXportComponent } from './data-xport.component';

describe('DataXportComponent', () => {
  let component: DataXportComponent;
  let fixture: ComponentFixture<DataXportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataXportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataXportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
