import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardModule } from './card.module';

/** Existing usage, copied from the library's own data-filter / data-sort screens: must not change */
@Component({
  template: `
    <verben-card
      id="classic"
      width="24rem"
      borderRadius="1rem"
      [border]="'1px solid var(--vbn-color-primary)'"
      bgColor="var(--vbn-color-surface)"
      [height]="'32rem'"
      mg="4px"
      textColor="red"
      [aspectRatio]="1.5"
    >
      <div card-header class="card-header">Header</div>
      <div card-body class="card-body">Body</div>
      <div card-footer class="card-footer">Footer</div>
    </verben-card>

    <verben-card id="bodyOnly"><p card-body>Only a body</p></verben-card>

    <verben-card id="added" heading="VIN-MXTUOE" subheading="Dangote" variant="plain" interactive selected pd="12px 20px">
      <img card-media src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" />
      <div card-body>Lines</div>
    </verben-card>

    <verben-card
      id="corner"
      heading="Report"
      tag="Draft"
      tagTone="warning"
      [actions]="['minimize', 'close', { id: 'pin', text: 'Pin' }]"
      [(collapsed)]="collapsed"
      (action)="last = $event"
    >
      <div card-body>Body</div>
    </verben-card>

    <verben-card id="slot" interactive (click)="clicks = clicks + 1">
      <button card-actions class="card-action" id="mine">★</button>
      <div card-body>Body</div>
    </verben-card>

    <verben-card id="overlay" tag="New">
      <div card-media style="height: 40px"></div>
      <div card-body>Body</div>
    </verben-card>
  `,
})
class HostComponent {
  collapsed = false;
  last = '';
  clicks = 0;
}

describe('verben-card', () => {
  let fixture: ComponentFixture<HostComponent>;
  const card = (id: string) => fixture.nativeElement.querySelector(`#${id} .card`) as HTMLElement;
  const visible = (el: Element | null) => !!el && getComputedStyle(el).display !== 'none';

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [HostComponent], imports: [CardModule] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders existing markup exactly as before: same wrappers, classes and inline styles', () => {
    const c = card('classic');
    expect(Array.from(c.children).filter(visible).map((e) => e.className.split(' ')[0])).toEqual([
      'card-header',
      'card-body',
      'card-footer',
    ]);
    expect(c.style.width).toBe('24rem');
    expect(c.style.height).toBe('32rem');
    expect(c.style.borderRadius).toBe('1rem');
    expect(c.style.margin).toBe('4px');
    expect(c.style.padding).toBe('10px'); // default pd, as before
    expect(c.style.color).toBe('red');
    expect(c.style.aspectRatio).toContain('1.5');
    expect(c.querySelector('.card-header')!.textContent!.trim()).toBe('Header');
    // The section styles are unchanged (theme colors aren't loaded in tests, so check the spacing)
    const header = getComputedStyle(c.querySelector('.card-header')!);
    expect([header.paddingTop, header.paddingLeft]).toEqual(['10px', '15px']);
    expect(getComputedStyle(c.querySelector('.card-body')!).paddingTop).toBe('15px');
  });

  it('does not show sections that are not filled', () => {
    const c = card('bodyOnly');
    expect(visible(c.querySelector('.card-header'))).toBeFalse();
    expect(visible(c.querySelector('.card-footer'))).toBeFalse();
    expect(visible(c.querySelector('.card-body'))).toBeTrue();
  });

  it('adds the opt-in features only when asked', () => {
    const c = card('added');
    expect(c.querySelector('.card-heading')!.textContent).toContain('VIN-MXTUOE');
    expect(c.querySelector('.card-subheading')!.textContent).toContain('Dangote');
    expect(c.classList).toContain('card--plain');
    expect(c.classList).toContain('card--selected');
    expect(fixture.nativeElement.querySelector('#added').getAttribute('tabindex')).toBe('0');
    // Media stretches over the 20px side padding
    expect(getComputedStyle(c.querySelector('.card-media')!).marginLeft).toBe('-20px');

    const classic = card('classic');
    expect(classic.classList).not.toContain('card--plain');
    expect(fixture.nativeElement.querySelector('#classic').hasAttribute('tabindex')).toBeFalse();
  });

  it('renders no corner unless a tag, actions or [card-actions] content is given', () => {
    for (const id of ['classic', 'bodyOnly', 'added']) {
      expect(card(id).querySelector('.card-corner')).withContext(id).toBeNull();
      expect(card(id).classList).not.toContain('card--has-corner');
    }
  });

  it('shows the tag and the action buttons; minimize collapses the card', () => {
    const c = card('corner');
    const host = fixture.componentInstance;
    const tag = c.querySelector('.card-tag') as HTMLElement;
    expect(tag.textContent!.trim()).toBe('Draft');
    expect(tag.dataset['tone']).toBe('warning');

    const buttons = () => Array.from(c.querySelectorAll<HTMLButtonElement>('.card-action'));
    expect(buttons().map((b) => b.getAttribute('aria-label'))).toEqual(['Minimize', 'Close', 'Pin']);
    expect(buttons()[2].textContent!.trim()).toBe('Pin');

    buttons()[0].click();
    fixture.detectChanges();
    expect(host.collapsed).toBeTrue();
    expect(host.last).toBe('minimize');
    expect(visible(c.querySelector('.card-body'))).toBeFalse();
    expect(buttons()[0].getAttribute('aria-label')).toBe('Restore');
    expect(buttons()[0].getAttribute('aria-expanded')).toBe('false');

    buttons()[1].click();
    expect(host.last).toBe('close');

    // Two-way: the page can expand it again
    host.collapsed = false;
    fixture.detectChanges();
    expect(visible(c.querySelector('.card-body'))).toBeTrue();
  });

  it('shows [card-actions] content in the corner without clicking an interactive card', () => {
    const mine = card('slot').querySelector('.card-corner #mine') as HTMLButtonElement;
    expect(mine).not.toBeNull();
    mine.click();
    expect(fixture.componentInstance.clicks).toBe(0);
    card('slot').querySelector<HTMLElement>('.card-body')!.click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('floats the corner over card-media when there is no header', () => {
    expect(card('overlay').querySelector('.card-header')!.classList).toContain('is-overlay');
    expect(card('corner').querySelector('.card-header')!.classList).not.toContain('is-overlay');
  });
});
