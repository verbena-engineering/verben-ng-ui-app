class Importable<T> {
  constructor(
    public name: string,
    public description: string,
    public type: string,
    public data: T
  ) {}
}
