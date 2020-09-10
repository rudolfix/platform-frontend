import { EthereumAddressWithChecksum, withParams } from "@neufund/shared-utils";
import { inject, injectable } from "inversify";

import { authModuleAPI } from "../../../../auth/module";
import { IHttpClient } from "../../../../core/module";
import { TokenholdersSchema, TTokenholders } from "./EtoTokensApi.interfaces";

const BASE_PATH = "/api/eto-listing/tokens";

// Issuer endpoints
const TOKEN_HOLDERS = "/:tokenAddress/holders";

@injectable()
export class EtoTokensApi {
  constructor(@inject(authModuleAPI.symbols.authJsonHttpClient) private httpClient: IHttpClient) {}

  public async getTokenholdersList(
    tokenAddress: EthereumAddressWithChecksum,
  ): Promise<TTokenholders> {
    const response = await this.httpClient.get<TTokenholders>({
      baseUrl: BASE_PATH,
      url: withParams(TOKEN_HOLDERS, { tokenAddress }),
      responseSchema: TokenholdersSchema.toYup(),
    });

    return response.body;
  }
}
