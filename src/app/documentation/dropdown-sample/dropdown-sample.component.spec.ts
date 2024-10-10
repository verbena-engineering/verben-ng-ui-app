import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSampleComponent } from './dropdown-sample.component';

describe('DropdownSampleComponent', () => {
  let component: DropdownSampleComponent;
  let fixture: ComponentFixture<DropdownSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
