import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MailPayload } from 'verben-ng-ui';

@Component({
  selector: 'verben-mail',
  templateUrl: './verben-mail.component.html',
  styleUrl: './verben-mail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerbenMailComponent {
  onSubmitMail(mailPayload: MailPayload) {
    //console.log('payload:', mailPayload);
  }
}
