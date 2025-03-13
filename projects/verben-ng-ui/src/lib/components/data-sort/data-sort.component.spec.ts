import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSortComponent } from './data-sort.component';

describe('DataSortComponent', () => {
  let component: DataSortComponent;
  let fixture: ComponentFixture<DataSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
