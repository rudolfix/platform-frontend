import { authModuleAPI, IHttpClient, IHttpResponse } from "@neufund/shared-modules";
import { inject, injectable } from "inversify";
import * as Web3Utils from "web3-utils";

import * as YupTS from "../../yup-ts.unsafe";

const BASE_PATH = "/api/gas/";
const GET_GAS_PATH = "/gas";

@injectable()
export class GasApi {
  constructor(@inject(authModuleAPI.symbols.authJsonHttpClient) private httpClient: IHttpClient) {}

  public async getGas(): Promise<IHttpResponse<GasModelShape>> {
    const results = await this.httpClient.get<GasModelShape>({
      baseUrl: BASE_PATH,
      url: GET_GAS_PATH,
      responseSchema: gasModelSchema,
    });

    return {
      ...results,
      body: this.transformBody(results.body),
    };
  }

  private transformBody(gas: GasModelShape): GasModelShape {
    return {
      fast: Web3Utils.toWei(gas.fast, "gwei"),
      fastest: Web3Utils.toWei(gas.fastest, "gwei"),
      safeLow: Web3Utils.toWei(gas.safeLow, "gwei"),
      standard: Web3Utils.toWei(gas.standard, "gwei"),
    };
  }
}

const GasModel = YupTS.object({
  fast: YupTS.string(),
  fastest: YupTS.string(),
  safeLow: YupTS.string(),
  standard: YupTS.string(),
});
export type GasModelShape = YupTS.TypeOf<typeof GasModel>;
const gasModelSchema = GasModel.toYup();
