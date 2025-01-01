import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRunPopsComponent } from './test-run-pops.component';

describe('TestRunPopsComponent', () => {
  let component: TestRunPopsComponent;
  let fixture: ComponentFixture<TestRunPopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestRunPopsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestRunPopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
