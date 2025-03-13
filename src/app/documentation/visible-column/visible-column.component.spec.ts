import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleColumnComponent } from './visible-column.component';

describe('DataTableComponent', () => {
  let component:VisibleColumnComponent;
  let fixture: ComponentFixture<VisibleColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisibleColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisibleColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
