import { formatAmount, initialsOf, toAspectRatio, toPadding } from './card-utils';

describe('unstable card: utils', () => {
  it('builds initials from names and handles', () => {
    expect(initialsOf('Ada Lovelace')).toBe('AL');
    expect(initialsOf('ada.lovelace')).toBe('AL');
    expect(initialsOf('Ngozi')).toBe('N');
    expect(initialsOf('  chidi  okafor  emeka ')).toBe('CO');
    expect(initialsOf('')).toBe('');
    expect(initialsOf(undefined)).toBe('');
  });

  it('formats signed amounts with a real minus sign', () => {
    const plus = formatAmount(25000, { currency: 'NGN', locale: 'en-NG' });
    const minus = formatAmount(-4500.5, { currency: 'NGN', locale: 'en-NG' });
    expect(plus.startsWith('+')).toBeTrue();
    expect(plus).toContain('25,000.00');
    expect(minus.startsWith('−')).toBeTrue();
    expect(minus).toContain('4,500.50');
    expect(formatAmount(0, { currency: 'USD', locale: 'en-US' })).toBe('$0.00');
    // The naira sign, even in a US locale
    expect(formatAmount(500, { currency: 'NGN', locale: 'en-US' })).toBe('+₦500.00');
  });

  it('can format unsigned and survives a bad currency code', () => {
    expect(formatAmount(1200, { currency: 'USD', locale: 'en-US', signed: false })).toBe('$1,200.00');
    expect(formatAmount(-1200, { currency: 'USD', locale: 'en-US', signed: false })).toBe('−$1,200.00');
    expect(formatAmount(10, { currency: 'NOT-A-CODE', locale: 'en-US' })).toBe('+10.00');
  });

  it('turns ratios into CSS aspect-ratio values', () => {
    expect(toAspectRatio('16:9')).toBe('16 / 9');
    expect(toAspectRatio('4/5')).toBe('4 / 5');
    expect(toAspectRatio(1)).toBe('1 / 1');
    expect(toAspectRatio('wide')).toBeNull();
    expect(toAspectRatio(null)).toBeNull();
  });

  it("reads <verben-card>'s pd like CSS padding (vertical, horizontal)", () => {
    expect(toPadding('16px')).toEqual(['16px', '16px']);
    expect(toPadding('50px 30px')).toEqual(['50px', '30px']);
    expect(toPadding(' 1rem  2rem 3rem 4rem ')).toEqual(['1rem', '2rem']);
    expect(toPadding(12)).toEqual(['12px', '12px']);
    expect(toPadding('')).toBeNull();
    expect(toPadding(undefined)).toBeNull();
  });
});
