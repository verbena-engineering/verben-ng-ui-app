export class DropdownLoadEvent {
  private _loadTimes: number;

  get loadTimes(): number {
    return this._loadTimes;
  }

  constructor() {
    this._loadTimes = 0;
  }

  increaseLoadTime() {
    this._loadTimes += 1;
  }

  reset() {
    this._loadTimes = 0;
  }
}
