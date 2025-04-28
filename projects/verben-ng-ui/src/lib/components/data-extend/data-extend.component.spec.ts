import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExtendComponent } from './data-extend.component';

describe('DataExtendComponent', () => {
  let component: DataExtendComponent;
  let fixture: ComponentFixture<DataExtendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataExtendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
