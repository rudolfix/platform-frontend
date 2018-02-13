import { inject, injectable } from "inversify";

import { IHttpClient } from "./IHttpClient";
import { JsonHttpClientSymbol } from "./JsonHttpClient";

//This is a mock implementation

export interface IStoreEndpointResponse {
  vault: string;
}

export const UsersApiSymbol = "UsersApiSymbol";

@injectable()
export class UsersApi {
  // tslint:disable-next-line
  constructor(@inject(JsonHttpClientSymbol) private httpClient: IHttpClient) {}
  // tslint:disable-next-line
  public async createLightwalletAccount(email: string, salt: string): Promise<void> {
    return Promise.resolve();
  }
  // tslint:disable-next-line
  public async createAccount(email: string, salt: string): Promise<void> {
    return Promise.resolve();
  }
}
