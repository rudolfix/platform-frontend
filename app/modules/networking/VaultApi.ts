import { inject, injectable } from "inversify";

import { IHttpClient } from "./IHttpClient";
import { JsonHttpClientSymbol } from "./JsonHttpClient";

//This is a mock implementation

export const SignatureAuthApiSymbol = "VaultApiSymbol";

@injectable()
export class VaultApi {
  // tslint:disable-next-line
  constructor(@inject(JsonHttpClientSymbol) private httpClient: IHttpClient) {}
  // tslint:disable-next-line
  public async store(password: string, salt: string, serializedVault: string): Promise<void> {
    return Promise.resolve();
  }
}
