import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { TPartialEtoSpecData } from "./EtoApi.interfaces";
import { IEtoFiles, TEtoUploadFile } from "./EtoFileApi.interfaces";
import { getSampleEtoFiles } from "./fixtures";
import { IHttpResponse, IHttpClient } from "../client/IHttpClient";

const BASE_PATH = "/api/eto-listing/";
const ETO_DOCUMENTS_PATH = "/etos/me/documents";
const ETO_DOCUMENTS_INFO_PATH = "/etos/me/documents/state_info";
const test = "/etos/me/templates";
@injectable()
export class EtoFileApi {
  constructor(@inject(symbols.authorizedHttpClient) private httpClient: IHttpClient) {}
  private etoFiles = getSampleEtoFiles();

  public async getEtoFileInfo(): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.httpClient.get<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: test,
    });
  }

  public async getFileEtoData(): Promise<IHttpResponse<TPartialEtoSpecData>> {
    return await this.httpClient.get<TPartialEtoSpecData>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_PATH,
    });
  }

  public async putFileEtoData(file: File, name: TEtoUploadFile): Promise<IEtoFiles> {
    this.etoFiles.uploadedDocuments[name].url = "IPFS url";
    this.etoFiles.uploadedDocuments[name].file = file;
    return Promise.resolve(this.etoFiles);
  }
}
