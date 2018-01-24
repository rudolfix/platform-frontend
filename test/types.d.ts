type Dictionary<T> = { [id: string]: T };

type AsInterface<T> = { [K in keyof T]: T[K] };
