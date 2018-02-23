import { injectable } from "inversify";

/** Simple adapter on local storage */
@injectable()
export class Storage {
  constructor(private localStorage: any) {}

  public setKey(key: string, value: string): void {
    this.localStorage.setItem(key, value);
  }

  public getKey(key: string): string | undefined {
    return this.localStorage.getItem(key);
  }
}
