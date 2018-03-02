import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../dependencies/Logger";
import { IHttpClient } from "../client/IHttpClient";
import { IVault, VaultValidator } from "./interfaces";

export class VaultApiError extends Error {}
export class VaultNotExisting extends VaultApiError {}
export class VaultAlreadyExisting extends VaultApiError {}
export class VaultCorrupt extends VaultApiError {}

const USER_VAULT_ROOT = "/api/wallet";

@injectable()
export class VaultApi {
  constructor(
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.logger) private logger: ILogger,
  ) {}

  public async store(key: string, serializedVault: string): Promise<void> {
    this.logger.info("Storing Vault with Key: ", key);

    const response = await this.httpClient.post<string>({
      baseUrl: USER_VAULT_ROOT,
      url: `/vault/${key}`,
      responseSchema: VaultValidator,
      body: { wallet: serializedVault },
      allowedStatusCodes: [409],
    });

    if (response.statusCode === 409) {
      throw new VaultAlreadyExisting();
    }
    if (response.statusCode === 413) {
      throw new VaultCorrupt();
    }
  }

  public async retrieve(key: string): Promise<string> {
    this.logger.info("Retrieving Vault with Key: ", key);

    const response = await this.httpClient.get<IVault>({
      baseUrl: USER_VAULT_ROOT,
      url: `/vault/${key}`,
      responseSchema: VaultValidator,
      allowedStatusCodes: [404],
    });

    if (response.statusCode === 404) {
      throw new VaultNotExisting();
    }

    return response.body.wallet;
  }
}
