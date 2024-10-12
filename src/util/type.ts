export type ExtractKeyValues<T extends ReadonlyArray<unknown>, Key extends string> = Extract<
  T[number],
  { [key in Key]: unknown }
>[Key];
