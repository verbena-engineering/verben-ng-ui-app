import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenNgUiComponent } from './verben-ng-ui.component';

describe('VerbenNgUiComponent', () => {
  let component: VerbenNgUiComponent;
  let fixture: ComponentFixture<VerbenNgUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbenNgUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenNgUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
