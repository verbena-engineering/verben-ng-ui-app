import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueSampleComponent } from './dialogue-sample.component';

describe('DialogueSampleComponent', () => {
  let component: DialogueSampleComponent;
  let fixture: ComponentFixture<DialogueSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogueSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogueSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
