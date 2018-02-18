import { inject, injectable } from "inversify";

import { symbols } from "../../symbols";
import { IHttpClient } from "./IHttpClient";

//This is a mock implementation

export interface IStoreEndpointResponse {
  vault: string;
}

@injectable()
export class UsersApi {
  // tslint:disable-next-line
  constructor(@inject(symbols.jsonHttpClient) private httpClient: IHttpClient) {}
  // tslint:disable-next-line
  public async createLightwalletAccount(email: string, salt: string): Promise<void> {
    return Promise.resolve();
  }
  // tslint:disable-next-line
  public async createAccount(email: string, salt: string): Promise<void> {
    return Promise.resolve();
  }
}
