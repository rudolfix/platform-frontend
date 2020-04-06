interface ISingleKeyStorage<T> {
  get(): Promise<T | undefined>;

  set(jwt: T): Promise<void>;

  clear(): Promise<void>;
}

export { ISingleKeyStorage };
