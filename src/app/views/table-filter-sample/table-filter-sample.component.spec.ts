import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterSampleComponent } from './table-filter-sample.component';

describe('TableFilterSampleComponent', () => {
  let component: TableFilterSampleComponent;
  let fixture: ComponentFixture<TableFilterSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableFilterSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFilterSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
