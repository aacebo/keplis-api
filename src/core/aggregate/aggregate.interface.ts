export interface IAggregate<T = string> {
  readonly _id: T;
  readonly count: number;
}
