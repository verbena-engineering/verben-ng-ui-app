import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { initialsOf } from './card-utils';

export type VbnAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type VbnTone = 'neutral' | 'success' | 'error' | 'warning' | 'info';

/**
 * A round picture, initials or icon.
 *   <vbn-avatar src="me.jpg" name="Ada Lovelace"></vbn-avatar>   picture (initials if it fails)
 *   <vbn-avatar name="Ada Lovelace"></vbn-avatar>                "AL"
 *   <vbn-avatar tone="success"><verben-svg …/></vbn-avatar>      icon on a tinted circle
 * `overlap` pulls it up over a cover photo (profile cards).
 */
@Component({
  selector: 'vbn-avatar',
  standalone: true,
  imports: [NgIf],
  template: `
    <img *ngIf="src && !failed" [src]="src" [alt]="name ?? ''" (error)="failed = true" />
    <ng-container *ngIf="!src || failed">
      <span *ngIf="initials" aria-hidden="true">{{ initials }}</span>
      <ng-content></ng-content>
    </ng-container>
  `,
  styleUrls: ['./avatar.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vbn-avatar',
    '[class]': "'vbn-avatar vbn-avatar--' + size + ' vbn-avatar--' + tone",
    '[class.vbn-avatar--overlap]': 'overlap',
    '[attr.role]': "src && !failed ? null : 'img'",
    '[attr.aria-label]': "src && !failed ? null : name",
  },
})
export class VbnAvatarComponent implements OnChanges {
  @Input() src?: string | null;
  /** Used for the alt text and the initials */
  @Input() name?: string | null;
  @Input() size: VbnAvatarSize = 'md';
  /** Background tint for icons / initials */
  @Input() tone: VbnTone = 'neutral';
  /** Pull up over the element above it (a cover photo) */
  @Input({ transform: booleanAttribute }) overlap = false;

  initials = '';
  failed = false;

  ngOnChanges(): void {
    this.failed = false;
    this.initials = initialsOf(this.name);
  }
}
