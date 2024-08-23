import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenaUiLibraryComponent } from './verbena-ui-library.component';

describe('VerbenaUiLibraryComponent', () => {
  let component: VerbenaUiLibraryComponent;
  let fixture: ComponentFixture<VerbenaUiLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbenaUiLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenaUiLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
