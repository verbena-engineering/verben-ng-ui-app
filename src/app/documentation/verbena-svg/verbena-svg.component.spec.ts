import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenaSvgComponent } from './verbena-svg.component';

describe('VerbenaSvgComponent', () => {
  let component: VerbenaSvgComponent;
  let fixture: ComponentFixture<VerbenaSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenaSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenaSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
