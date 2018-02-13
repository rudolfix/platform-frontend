import { injectable } from "inversify";

export const StorageSymbol = "StorageSymbol";

@injectable()
export class Storage {
  constructor(private localStorage: any) {}

  public setKey = (key: string, value: string): void => {
    this.localStorage.setItem(key, value);
  };

  public getKey = (key: string): string => {
    return this.localStorage.getItem(key);
  };
}

//TODO: Bring back interface for storage
