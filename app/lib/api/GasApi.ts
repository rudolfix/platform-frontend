import { inject, injectable } from "inversify";
import * as YupTS from "../yup-ts";

import { symbols } from "../../di/symbols";
import { Web3Manager } from "../web3/Web3Manager";
import { IHttpClient, IHttpResponse } from "./client/IHttpClient";

const BASE_PATH = "/api/gas/";
const GET_GAS_PATH = "/gas";

@injectable()
export class GasApi {
  constructor(
    @inject(symbols.authorizedHttpClient) private httpClient: IHttpClient,
    @inject(symbols.web3Manager) private web3: Web3Manager,
  ) {}

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
      fast: this.web3.internalWeb3Adapter.web3.toWei(gas.fast, "gwei"),
      fastest: this.web3.internalWeb3Adapter.web3.toWei(gas.fastest, "gwei"),
      safeLow: this.web3.internalWeb3Adapter.web3.toWei(gas.safeLow, "gwei"),
      standard: this.web3.internalWeb3Adapter.web3.toWei(gas.standard, "gwei"),
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
