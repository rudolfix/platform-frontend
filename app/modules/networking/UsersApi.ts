import { inject, injectable } from "inversify";

import { IHttpClient } from "./IHttpClient";
import { JSON_HTTP_CLIENT_SYMBOL } from "./JsonHttpClient";

//This is a mock implementation

export interface IStoreEndpointResponse {
  vault: string;
}

export const USERS_API_SYMBOL = Symbol();

@injectable()
export class UsersApi {
  // tslint:disable-next-line
  constructor(@inject(JSON_HTTP_CLIENT_SYMBOL) private httpClient: IHttpClient) {}
  // tslint:disable-next-line
  public async createLightwalletAccount(email: string, salt: string): Promise<void> {
    return Promise.resolve();
  }
  // tslint:disable-next-line
  public async createAccount(email: string, salt: string): Promise<void> {
    return Promise.resolve();
  }
}
