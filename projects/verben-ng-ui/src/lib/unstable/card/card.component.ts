import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  booleanAttribute,
  isDevMode,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { VbnAvatarComponent, VbnAvatarSize } from './avatar.component';
import { VbnCardDescriptionComponent, VbnCardTitleComponent } from './card-parts';
import { toAspectRatio, toPadding } from './card-utils';

/*
 * ⚠️ UNSTABLE — composable card, under team review. See README.md here.
 *
 * shadcn-style: small parts you combine in any order, any depth.
 *   <vbn-card>
 *     <vbn-card-header avatar title="…" description="…">
 *       <vbn-card-action>…</vbn-card-action>
 *     </vbn-card-header>
 *     <img vbnCardMedia ratio="4/5" src="…" alt="…">
 *     <vbn-card-content>… sub-cards go here …</vbn-card-content>
 *     <vbn-card-footer justify="between">…</vbn-card-footer>
 *   </vbn-card>
 *
 * Existing <verben-card> markup works too: same inputs (pd, bgColor, width…) and
 * the same card-header / card-body / card-footer slots, so moving a screen over
 * is renaming the tag.
 */

let warnedOnce = false;

export type VbnCardVariant = 'outline' | 'elevated' | 'filled' | 'ghost';
export type VbnCardSize = 'sm' | 'md' | 'lg';

/**
 * Header with three optional shortcuts so the common case is one line:
 *   <vbn-card-header avatar title="Ada Lovelace" description="2h"></vbn-card-header>
 * `avatar` alone shows initials from the title; `avatar="photo.jpg"` shows the photo.
 * Anything you put inside (e.g. <vbn-card-action>) is added after them.
 */
@Component({
  selector: 'vbn-card-header, [vbnCardHeader]',
  standalone: true,
  imports: [NgIf, VbnAvatarComponent, VbnCardTitleComponent, VbnCardDescriptionComponent],
  template: `
    <vbn-avatar *ngIf="avatar != null" [src]="avatar || null" [name]="title" [size]="avatarSize"></vbn-avatar>
    <vbn-card-title *ngIf="title">{{ title }}</vbn-card-title>
    <vbn-card-description *ngIf="description">{{ description }}</vbn-card-description>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'vbn-card-header' },
})
export class VbnCardHeaderComponent {
  @Input() title?: string | null;
  @Input() description?: string | null;
  /** Image URL, or an empty attribute (`avatar`) for initials from the title */
  @Input() avatar?: string | null;
  @Input() avatarSize: VbnAvatarSize = 'md';
}

/**
 * The card container. `title` / `description` render a header for you, which
 * keeps nested sections short: <vbn-card title="Shipping">…</vbn-card>.
 * Usable as an element or on any tag: <article vbnCard>, <a vbnCard href>.
 * Also takes every <verben-card> input, see "Same inputs as <verben-card>" below.
 */
@Component({
  selector: 'vbn-card, [vbnCard]',
  standalone: true,
  imports: [NgIf, VbnCardHeaderComponent],
  template: `
    <vbn-card-header *ngIf="title || description" [title]="title" [description]="description"></vbn-card-header>
    <ng-content></ng-content>
  `,
  // One shared stylesheet for every card part (all classes are vbn-card*)
  styleUrls: ['./card.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vbn-card',
    '[attr.data-variant]': 'variant',
    '[attr.data-size]': 'size',
    '[class.vbn-card--horizontal]': "orientation === 'horizontal'",
    '[class.vbn-card--center]': "align === 'center'",
    '[class.vbn-card--interactive]': 'interactive',
    // <verben-card> inputs, applied to this card only (nested cards keep their own look)
    '[style.--_pad-y]': 'padding?.[0]',
    '[style.--_pad-x]': 'padding?.[1]',
    '[style.margin]': 'mg',
    '[style.width]': 'width',
    '[style.height]': 'height',
    '[style.aspect-ratio]': 'ratio',
    '[style.background-color]': 'bgColor',
    '[style.color]': 'textColor',
    '[style.border]': 'border',
    '[style.border-radius]': 'borderRadius',
    '[class.vbn-card--disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled || null',
  },
})
export class VbnCardComponent {
  @Input() variant: VbnCardVariant = 'outline';
  @Input() size: VbnCardSize = 'md';
  /** 'horizontal' puts children side by side (avatar + text, thumbnail + details) */
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  /** 'center' centers text, avatar and footer (profile cards) */
  @Input() align: 'start' | 'center' = 'start';
  /** Hover and focus styles for clickable cards (use on <a vbnCard> or <button vbnCard>) */
  @Input({ transform: booleanAttribute }) interactive = false;
  /** Shortcut: renders a <vbn-card-header> with this title */
  @Input() title?: string | null;
  @Input() description?: string | null;

  // ----- Same inputs as <verben-card>, so existing markup works unchanged -----

  /** Inner spacing, like CSS padding: "16px" or "12px 20px" (vertical horizontal) */
  @Input() set pd(value: string | number | null | undefined) {
    this.padding = toPadding(value);
  }
  /** Outer margin, e.g. "0 0 16px" */
  @Input() mg?: string | null;
  @Input() width?: string | null;
  @Input() height?: string | null;
  /** 1.5, "16:9" or "4/3" */
  @Input() set aspectRatio(value: string | number | null | undefined) {
    this.ratio = toAspectRatio(value);
  }
  @Input() bgColor?: string | null;
  @Input() textColor?: string | null;
  /** CSS border shorthand, e.g. "1px solid var(--vbn-color-primary)" */
  @Input() border?: string | null;
  @Input() borderRadius?: string | null;
  /** Dims the card and blocks clicks inside it */
  @Input({ transform: booleanAttribute }) disabled = false;

  padding: [string, string] | null = null;
  ratio: string | null = null;

  constructor() {
    if (isDevMode() && !warnedOnce) {
      warnedOnce = true;
      console.warn(
        '[verben-ng-ui] <vbn-card> (UnstableCardModule) is UNSTABLE and under review. ' +
          'Its API may change before it is promoted.',
      );
    }
  }
}
