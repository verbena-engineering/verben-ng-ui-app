import {
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { CardData } from '../card-data';

/** One button shown by <verben-card-hover-actions>. */
export interface CardHoverAction {
  /** Emitted through (action) when clicked. */
  id: string;
  /** Tooltip and aria-label (and the button text when there is no icon). */
  label: string;
  /**
   * Icon name for <verben-svg>: the library's icons, then the app's
   * assets/icons/<name>.svg. Omit to show `label` as text.
   */
  icon?: string;
  /** Icon width and height in px (default 14). */
  iconSize?: number;
  /**
   * Recolour the icon, e.g. 'currentColor' to follow the button's colour
   * (--card-action-color, dark mode). Default: the icon's own colours
   * (e.g. the red delete icon stays red).
   */
  iconColor?: string;
  disabled?: boolean;
  /** Extra classes for this button, e.g. 'danger'. */
  class?: string;
  /** Show this button for the given card. Omit to always show it. */
  canView?: (item: CardData) => boolean;
  /** Runs when clicked. (action) is emitted as well, so either can be used. */
  onSelect?: (item: CardData) => void;
}

export type CardHoverActionsPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

/**
 * Wraps a card and reveals a row of small action buttons while it is hovered
 * or has keyboard focus inside (always shown on touch screens, which can't
 * hover). Clicks on the buttons don't bubble to the card, whose own click
 * usually selects it.
 *
 * ```html
 * <verben-card-hover-actions [item]="item" [actions]="actions">
 *   <app-my-card [item]="item.data"></app-my-card>
 * </verben-card-hover-actions>
 * ```
 *
 * ```ts
 * readonly actions: CardHoverAction[] = [
 *   { id: 'delete', label: 'Delete', icon: 'delete',
 *     canView: (item) => item.data.DataState === 'New',
 *     onSelect: (item) => this.facade.removeUnsavedItem(item.data) },
 * ];
 * ```
 *
 * Inside <verben-left-card-data> you don't need to wrap anything: pass
 * [cardActions]="actions" and each card is wrapped for you.
 *
 * Look: `buttonClass` / per-action `class` (the built-in 'danger' turns red on
 * hover), the `--card-action-*` CSS variables, or fully custom buttons in the
 * `[hoverActions]` slot.
 */
@Component({
  selector: 'verben-card-hover-actions',
  templateUrl: './card-hover-actions.component.html',
  styleUrls: ['./card-hover-actions.component.css'],
})
export class CardHoverActionsComponent {
  /** The card being wrapped; passed to each action's canView / onSelect. */
  @Input({ required: true }) item!: CardData;
  @Input() actions: CardHoverAction[] = [];
  @Input() position: CardHoverActionsPosition = 'top-right';
  /** Keep the buttons visible without hovering. */
  @Input({ transform: booleanAttribute }) alwaysVisible = false;
  /** Disable all buttons, e.g. while a save is in flight. */
  @Input({ transform: booleanAttribute }) disabled = false;
  /** Classes applied to every button. */
  @Input() buttonClass = '';

  @Output() action = new EventEmitter<{ id: string; item: CardData }>();

  isVisible(action: CardHoverAction): boolean {
    return action.canView ? action.canView(this.item) : true;
  }

  onClick(action: CardHoverAction, event: Event): void {
    event.stopPropagation();
    if (this.disabled || action.disabled) return;
    action.onSelect?.(this.item);
    this.action.emit({ id: action.id, item: this.item });
  }
}
