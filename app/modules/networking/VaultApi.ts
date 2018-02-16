import { inject, injectable } from "inversify";

import { IHttpClient } from "./IHttpClient";
import { JSON_HTTP_CLIENT_SYMBOL } from "./JsonHttpClient";

//This is a mock implementation

export const VAULT_API_SYMBOL = Symbol();

@injectable()
export class VaultApi {
  // tslint:disable-next-line
  constructor(@inject(JSON_HTTP_CLIENT_SYMBOL) private httpClient: IHttpClient) {}
  // tslint:disable-next-line
  public async store(password: string, salt: string, serializedVault: string): Promise<void> {
    return Promise.resolve();
  }
}
