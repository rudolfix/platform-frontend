/**
 *  Cast a `value` to exclude `null` and `undefined`.
 *  Throws if either `null` or `undefined` was passed
 */
export function nonNullable<T>(value: T): NonNullable<T> {
  if (value !== undefined && value !== null) {
    return value as NonNullable<T>;
  }

  throw new Error(`Non nullable values expected, received ${value}`);
}
