import { TLibSymbol } from "./types";

const createLibSymbol = <T>(name: string) => Symbol(name) as TLibSymbol<T>;

export { createLibSymbol };
