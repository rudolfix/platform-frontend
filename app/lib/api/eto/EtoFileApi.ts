import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";
import { TGeneralEtoData, TPartialCompanyEtoData, TPartialEtoSpecData } from "./EtoApi.interfaces";
import { getSampleEtoFiles } from "./fixtures";

const BASE_PATH = "/api/eto-listing/";
const COMPANIES_ME_DATA_PATH = "/companies/me";
const COMPANIES_DATA_PATH = "/companies/";
const ETO_DATA_PATH = "/etos/me";
const ETO_SUBMISSION_PATH = "/etos/me/submission";
const ETO_PREVIEW_PATH = "/eto-previews/";

@injectable()
export class EtoApi {
  constructor(@inject(symbols.authorizedHttpClient) private httpClient: IHttpClient) {}

  public async getFileEtoData(): Promise<object> {
    return Promise.resolve(getSampleEtoFiles());
  }
}
