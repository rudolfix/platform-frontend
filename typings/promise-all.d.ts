type Promised<T> = { [P in keyof T]: Promise<T[P]> };
declare function promiseAll<T>(o: Promised<T>): Promise<T>;

declare module "promise-all" {
  export = promiseAll;
}
