import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleForDropdownsComponent } from './sample-for-dropdowns.component';

describe('SampleForDropdownsComponent', () => {
  let component: SampleForDropdownsComponent;
  let fixture: ComponentFixture<SampleForDropdownsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SampleForDropdownsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleForDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
