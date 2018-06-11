import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { IHttpClient, IHttpResponse } from "./client/IHttpClient";
import { TPartialEtoData } from "./EtoApi.interfaces";

const BASE_PATH = "/api/eto-listing/";
const COMPANIES_DATA_PATH = "/companies/me";

@injectable()
export class EtoApi {
  constructor(@inject(symbols.authorizedHttpClient) private httpClient: IHttpClient) {}

  public async getCompanyData(): Promise<IHttpResponse<TPartialEtoData>> {
    return await this.httpClient.get<TPartialEtoData>({
      baseUrl: BASE_PATH,
      url: COMPANIES_DATA_PATH,
    });
  }

  public async putCompanyData(data: TPartialEtoData): Promise<IHttpResponse<TPartialEtoData>> {
    return await this.httpClient.put<TPartialEtoData>({
      baseUrl: BASE_PATH,
      url: COMPANIES_DATA_PATH,
      body: data,
    });
  }
}
