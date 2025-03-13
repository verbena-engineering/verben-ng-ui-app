import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSampleComponent } from './notifications-sample.component';

describe('NotificationsSampleComponent', () => {
  let component: NotificationsSampleComponent;
  let fixture: ComponentFixture<NotificationsSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
