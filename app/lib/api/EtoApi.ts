import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { IHttpClient, IHttpResponse } from "./client/IHttpClient";
import { TPartialCompanyEtoData, TPartialEtoSpecData } from "./EtoApi.interfaces";

const BASE_PATH = "/api/eto-listing/";
const COMPANIES_DATA_PATH = "/companies/me";
const ETO_DATA_PATH = "/etos/me";

@injectable()
export class EtoApi {
  constructor(@inject(symbols.authorizedHttpClient) private httpClient: IHttpClient) {}

  public async getEtoData(): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.httpClient.get<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: ETO_DATA_PATH,
    });
  }

  public async putEtoData(data: TPartialEtoSpecData): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.httpClient.put<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: ETO_DATA_PATH,
      body: data,
    });
  }

  public async getCompanyData(): Promise<IHttpResponse<TPartialCompanyEtoData>> {
    return await this.httpClient.get<TPartialCompanyEtoData>({
      baseUrl: BASE_PATH,
      url: COMPANIES_DATA_PATH,
    });
  }

  public async putCompanyData(
    data: TPartialCompanyEtoData,
  ): Promise<IHttpResponse<TPartialCompanyEtoData>> {
    return await this.httpClient.put<TPartialCompanyEtoData>({
      baseUrl: BASE_PATH,
      url: COMPANIES_DATA_PATH,
      body: data,
    });
  }
}
