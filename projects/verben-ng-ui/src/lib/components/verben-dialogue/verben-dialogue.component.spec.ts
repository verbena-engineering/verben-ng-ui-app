import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbenDialogueComponent } from './verben-dialogue.component';

describe('VerbenDialogueComponent', () => {
  let component: VerbenDialogueComponent;
  let fixture: ComponentFixture<VerbenDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbenDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbenDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
