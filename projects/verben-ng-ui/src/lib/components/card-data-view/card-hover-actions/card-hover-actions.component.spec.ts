import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CardData } from '../card-data';
import { CardDataViewModule } from '../card-data-view.module';
import { By } from '@angular/platform-browser';
import { SvgComponent } from 'verben-ng-ui/src/lib/components/svg';
import { CardHoverAction, CardHoverActionsComponent } from './card-hover-actions.component';

const card = (title: string, state: string): CardData => ({
  selected: false,
  title,
  body: [],
  children: [],
  data: { title, state },
});

@Component({
  template: `
    <div id="parent" (click)="parentClicks = parentClicks + 1">
      <verben-card-hover-actions
        *ngFor="let item of items"
        [attr.data-title]="item.title"
        [item]="item"
        [actions]="actions"
        [disabled]="allDisabled"
        (action)="emitted.push($event)"
      >
        <div class="my-card">{{ item.title }}</div>
        <button hoverActions class="mine" (click)="customClicks = customClicks + 1">★</button>
      </verben-card-hover-actions>
    </div>

    <verben-left-card-data id="plain" [cardDataList]="items">
      <ng-template #card let-item><div class="tpl">{{ item.title }}</div></ng-template>
    </verben-left-card-data>

    <verben-left-card-data id="wrapped" [cardDataList]="items" [cardActions]="actions" cardActionsPosition="bottom-left">
      <ng-template #card let-item><div class="tpl">{{ item.title }}</div></ng-template>
    </verben-left-card-data>

    <verben-left-card-data id="family" [cardDataList]="family" [cardActions]="actions" [cardChildActions]="childActions">
      <ng-template #card let-item><div class="tpl">{{ item.title }}</div></ng-template>
      <ng-template #cardChild let-child><div class="child">{{ child.title }}</div></ng-template>
    </verben-left-card-data>
  `,
})
class HostComponent {
  items = [card('Draft one', 'Draft'), card('Posted one', 'Posted')];
  family: CardData[] = [
    { ...card('Parent', 'Posted'), isChildrenExpanded: true, children: [card('Child draft', 'Draft'), card('Child posted', 'Posted')] },
  ];
  childActions: CardHoverAction[] | null | undefined = undefined; // undefined: children use [actions]
  selected: CardData[] = [];
  emitted: { id: string; item: CardData }[] = [];
  parentClicks = 0;
  customClicks = 0;
  allDisabled = false;
  actions: CardHoverAction[] = [
    {
      id: 'delete',
      label: 'Delete draft',
      icon: 'delete',
      class: 'danger',
      canView: (item) => item.data.state === 'Draft',
      onSelect: (item) => this.selected.push(item),
    },
    { id: 'duplicate', label: 'Duplicate', icon: 'document-duplicate', onSelect: (item) => this.selected.push(item) },
    { id: 'cancel', label: 'Cancel' },
    { id: 'locked', label: 'Locked', disabled: true, onSelect: (item) => this.selected.push(item) },
  ];
}

describe('verben-card-hover-actions', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  const wrapper = (title: string) =>
    fixture.nativeElement.querySelector(`#parent [data-title="${title}"]`) as HTMLElement;
  const buttons = (el: HTMLElement) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('.card-hover-action'));
  const labels = (el: HTMLElement) => buttons(el).map((b) => b.getAttribute('aria-label'));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [CardDataViewModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('hides a button when canView returns false for the card', () => {
    expect(labels(wrapper('Draft one'))).toEqual(['Delete draft', 'Duplicate', 'Cancel', 'Locked']);
    expect(labels(wrapper('Posted one'))).toEqual(['Duplicate', 'Cancel', 'Locked']);
  });

  it('passes the card to onSelect and emits (action) with id and item', () => {
    const posted = host.items[1];
    buttons(wrapper('Posted one'))[0].click(); // Duplicate
    expect(host.selected).toEqual([posted]);
    expect(host.emitted).toEqual([{ id: 'duplicate', item: posted }]);

    buttons(wrapper('Posted one'))[1].click(); // Cancel: no onSelect, still emits
    expect(host.emitted[1]).toEqual({ id: 'cancel', item: posted });
  });

  it('does not let button clicks reach the card (or anything above it)', () => {
    buttons(wrapper('Draft one'))[1].click();
    (wrapper('Draft one').querySelector('.mine') as HTMLButtonElement).click(); // [hoverActions] slot
    expect(host.parentClicks).toBe(0);
    expect(host.customClicks).toBe(1);

    (wrapper('Draft one').querySelector('.my-card') as HTMLElement).click(); // the card itself still bubbles
    expect(host.parentClicks).toBe(1);
  });

  it('blocks clicks when disabled, for all buttons or one action', () => {
    const locked = buttons(wrapper('Draft one'))[3];
    expect(locked.disabled).toBeTrue();
    locked.dispatchEvent(new MouseEvent('click', { bubbles: true })); // even a forced click
    expect(host.selected).toEqual([]);

    host.allDisabled = true;
    fixture.detectChanges();
    const all = buttons(wrapper('Draft one'));
    expect(all.every((b) => b.disabled)).toBeTrue();
    all[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(host.selected).toEqual([]);
    expect(host.emitted).toEqual([]);
    expect(host.parentClicks).toBe(0);

    // The component's own guard too (browsers already skip clicks on disabled buttons)
    const cmp = fixture.debugElement.query(By.directive(CardHoverActionsComponent)).componentInstance as CardHoverActionsComponent;
    cmp.onClick(host.actions[1], new MouseEvent('click'));
    expect(host.selected).toEqual([]);
    expect(host.emitted).toEqual([]);
  });

  it("keeps an icon's own colours unless iconColor is set", () => {
    const svgs = fixture.debugElement
      .query(By.css('#parent verben-card-hover-actions'))
      .queryAll(By.directive(SvgComponent))
      .map((d) => d.componentInstance as SvgComponent);
    expect(svgs.map((c) => c.stroke)).toEqual(['', '']); // delete (red in the icon) and duplicate

    host.actions = host.actions.map((a) => (a.id === 'delete' ? { ...a, iconColor: 'currentColor' } : a));
    fixture.detectChanges();
    const recoloured = fixture.debugElement
      .query(By.css('#parent verben-card-hover-actions'))
      .queryAll(By.directive(SvgComponent))
      .map((d) => d.componentInstance as SvgComponent);
    expect(recoloured.map((c) => c.stroke)).toEqual(['currentColor', '']);
  });

  it('shows the label as text when an action has no icon', () => {
    const cancel = buttons(wrapper('Draft one'))[2];
    expect(cancel.querySelector('verben-svg')).toBeNull();
    expect(cancel.textContent!.trim()).toBe('Cancel');
    expect(cancel.title).toBe('Cancel');
    expect(buttons(wrapper('Draft one'))[0].classList).toContain('danger');
  });

  describe('verben-left-card-data [cardActions]', () => {
    const list = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;

    it('renders cards exactly as before when cardActions is not set', () => {
      expect(list('plain').querySelector('verben-card-hover-actions')).toBeNull();
      const tpl = list('plain').querySelector('.tpl') as HTMLElement;
      expect(tpl.parentElement!.className).toContain('full-width'); // no wrapper in between
    });

    it('wraps each card with the hover buttons and its CardData', () => {
      const wrapped = Array.from(list('wrapped').querySelectorAll<HTMLElement>('verben-card-hover-actions'));
      expect(wrapped.length).toBe(2);
      expect(wrapped[0].querySelector('.tpl')!.textContent).toContain('Draft one');
      expect(wrapped[0].querySelector('.card-hover-actions')!.classList).toContain('bottom-left');
      expect(labels(wrapped[1])).toEqual(['Duplicate', 'Cancel', 'Locked']); // canView got the right item

      buttons(wrapped[1])[0].click();
      expect(host.selected).toEqual([host.items[1]]);
    });

    it('gives child cards the same buttons, with their own CardData', () => {
      const children = Array.from(list('family').querySelectorAll<HTMLElement>('.childrenPadding verben-card-hover-actions'));
      expect(children.map((c) => c.querySelector('.child')!.textContent!.trim())).toEqual(['Child draft', 'Child posted']);
      expect(labels(children[0])).toEqual(['Delete draft', 'Duplicate', 'Cancel', 'Locked']); // canView saw the child
      expect(labels(children[1])).toEqual(['Duplicate', 'Cancel', 'Locked']);

      buttons(children[1])[0].click();
      expect(host.selected).toEqual([host.family[0].children[1]]);
    });

    it('uses cardChildActions for children when set, and none for []', () => {
      host.childActions = [{ id: 'open', label: 'Open' }];
      fixture.detectChanges();
      const children = () => Array.from(list('family').querySelectorAll<HTMLElement>('.childrenPadding verben-card-hover-actions'));
      expect(children().map(labels)).toEqual([['Open'], ['Open']]);
      // the parent card keeps [cardActions]
      const parent = list('family').querySelector('verben-card-hover-actions') as HTMLElement;
      expect(labels(parent)).toEqual(['Duplicate', 'Cancel', 'Locked']);

      host.childActions = [];
      fixture.detectChanges();
      expect(children().length).toBe(0);
      expect(list('family').querySelectorAll('.childrenPadding .child').length).toBe(2); // still rendered, unwrapped
    });

    it('drops the wrapper again when cardActions is emptied', () => {
      fixture.debugElement.children
        .map((d) => d.componentInstance)
        .filter((c) => c && 'cardActions' in c && c.cardActions?.length)
        .forEach((c) => (c.cardActions = []));
      fixture.detectChanges();
      expect(list('wrapped').querySelector('verben-card-hover-actions')).toBeNull();
    });
  });
});
