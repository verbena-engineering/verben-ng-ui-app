import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleContainerComponent } from './sample-container.component';

describe('SampleContainerComponent', () => {
  let component: SampleContainerComponent;
  let fixture: ComponentFixture<SampleContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SampleContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
