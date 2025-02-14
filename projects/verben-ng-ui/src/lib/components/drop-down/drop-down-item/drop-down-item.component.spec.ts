import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownItemComponent } from './drop-down-item.component';

describe('DropDownItemComponent', () => {
  let component: DropDownItemComponent;
  let fixture: ComponentFixture<DropDownItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropDownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
