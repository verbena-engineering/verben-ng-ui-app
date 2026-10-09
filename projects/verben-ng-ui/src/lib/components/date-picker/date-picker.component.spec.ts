import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker.component';
import { DatePickerModule } from './date-picker.module';
import { DateRange, DateSelection } from './date-picker.types';

/** Every classic input in one template: it must keep compiling and working */
@Component({
  template: `
    <app-date-picker
      #classic
      placeholder="Due date"
      format="DD/MM/YYYY"
      [minDate]="min"
      [maxDate]="max"
      [disabled]="false"
      bgColor="var(--vbn-color-surface)"
      border="1px solid red"
      [useDropdowns]="true"
      yearPlaceholder="Year"
      monthPlaceholder="Month"
      [showTime]="false"
      [overlayWidth]="400"
      datePickerWidth="400px"
      [useDefaultDate]="false"
      [(date)]="date"
    ></app-date-picker>

    <app-date-picker #model [(ngModel)]="value"></app-date-picker>
    <app-date-picker #ranged selectionMode="range" [(ngModel)]="rangeValue" [(range)]="range"></app-date-picker>
    <app-date-picker #timed [showTime]="true" [(ngModel)]="timeValue"></app-date-picker>
    <app-date-picker #defaulted [useDefaultDate]="true" [(ngModel)]="defaultValue"></app-date-picker>
    <app-date-picker #simple variant="simple" [today]="today" [(selectionMode)]="simpleMode" [(ngModel)]="simpleValue"></app-date-picker>
    <app-date-picker #advanced variant="advanced" [today]="today" (selectionChange)="lastSelection = $event"></app-date-picker>
  `,
})
class HostComponent {
  @ViewChild('classic') classic!: DatePickerComponent;
  @ViewChild('model') model!: DatePickerComponent;
  @ViewChild('ranged') ranged!: DatePickerComponent;
  @ViewChild('timed') timed!: DatePickerComponent;
  @ViewChild('defaulted') defaulted!: DatePickerComponent;
  @ViewChild('simple') simple!: DatePickerComponent;
  @ViewChild('advanced') advanced!: DatePickerComponent;

  min = new Date(2026, 0, 1);
  max = new Date(2026, 11, 31);
  today = new Date(2026, 9, 7); // 7 Oct 2026
  date: Date | string | null = '2026-10-07T00:00:00Z';
  value: unknown = null;
  rangeValue: unknown = null;
  range: DateRange | null = null;
  timeValue: unknown = '2026-10-07T14:30:00';
  defaultValue: unknown = null;
  simpleMode: 'default' | 'range' | 'preset' = 'default';
  simpleValue: unknown = null;
  lastSelection: DateSelection | null = null;
}

describe('app-date-picker', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [DatePickerModule, FormsModule],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();
    tick();
  }));

  it('keeps the classic API: [(date)], format, a "Z" date read as local', () => {
    expect(host.classic.displayText).toBe('07/10/2026');
    host.classic.onDayPick(new Date(2026, 9, 9));
    expect(host.date instanceof Date).toBeTrue();
    expect((host.date as Date).getDate()).toBe(9);
    expect(host.classic.open).toBeFalse();
  });

  it('gives ngModel a local date string for one day', fakeAsync(() => {
    host.model.onDayPick(new Date(2026, 9, 7));
    expect(host.value).toBe('2026-10-07T00:00:00');
  }));

  it('picks a range with two clicks: ngModel strings and [(range)] dates', () => {
    host.ranged.onDayPick(new Date(2026, 9, 5));
    expect(host.rangeValue).toBeNull();
    host.ranged.onDayPick(new Date(2026, 9, 2)); // earlier day restarts
    host.ranged.onDayPick(new Date(2026, 9, 9));
    expect(host.rangeValue).toEqual(['2026-10-02T00:00:00', '2026-10-09T23:59:59']);
    expect(host.range?.[0].getDate()).toBe(2);
    expect(host.range?.[1].getDate()).toBe(9);
  });

  it('showTime keeps the time, stays open, and changes the time in place', () => {
    expect(host.timed.displayText).toBe('10/07/2026 14:30');
    host.timed.openPopup();
    host.timed.onDayPick(new Date(2026, 9, 8));
    expect(host.timeValue).toBe('2026-10-08T14:30:00');
    expect(host.timed.open).toBeTrue();
    host.timed.setTime(23, 59, true);
    expect(host.timeValue).toBe('2026-10-08T23:59:59');
  });

  it('useDefaultDate fills in today', () => {
    const today = new Date();
    expect(String(host.defaultValue).slice(0, 10)).toBe(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    );
  });

  it('simple: the Range checkbox switches mode, a preset gives a labelled range', () => {
    host.simple.toggleRange();
    fixture.detectChanges();
    expect(host.simpleMode).toBe('range');
    const lastMonth = host.simple.presetList.find((p) => p.id === 'last-month')!;
    host.simple.onPresetChoose(lastMonth);
    expect(host.simpleValue).toEqual(['2026-09-01T00:00:00', '2026-09-30T23:59:59']);
    expect(host.simple.displayText).toBe('Last month (09/01/2026 – 09/30/2026)');
  });

  it('advanced: offers Date, Range and Periods tabs', () => {
    expect(host.advanced.modeList).toEqual(['default', 'range', 'preset']);
    host.advanced.setMode('preset');
    const q3 = host.advanced.presetList.find((p) => p.id === 'last-quarter')!;
    host.advanced.onPresetChoose(q3);
    expect(host.lastSelection?.mode).toBe('preset');
    expect(host.lastSelection?.presetId).toBe('last-quarter');
  });

  it('the default variant shows no mode switch and no presets', () => {
    expect(host.model.modeList).toEqual(['default']);
    expect(host.model.variant).toBe('default');
  });
});
