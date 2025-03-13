import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenMailComponent } from './verben-mail.component';

describe('DataTableComponent', () => {
  let component:VerbenMailComponent;
  let fixture: ComponentFixture<VerbenMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerbenMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
