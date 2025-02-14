import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataColumnsComponent } from './data-columns.component';

describe('DataColumnsComponent', () => {
  let component: DataColumnsComponent;
  let fixture: ComponentFixture<DataColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataColumnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
