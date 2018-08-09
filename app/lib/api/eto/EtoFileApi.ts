import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";
import { TPartialEtoSpecData } from "./EtoApi.interfaces";
import {  IEtoDocument } from "./EtoFileApi.interfaces";
import { getSampleEtoFiles } from "./fixtures";

const BASE_PATH = "/api/eto-listing/etos";
const ETO_DOCUMENTS_PATH = "/me/documents";
const ETO_DOCUMENTS_INFO_PATH = "/me/documents/state_info";
const ETO_TEMPLATES_PATH = "/me/templates";
@injectable()
export class EtoFileApi {
  constructor(@inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient) {}

  public async getAllEtoDocuments(): Promise<IHttpResponse<any>> {
    return await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_PATH,
    });
  }

  public async uploadEtoDocument(Document: IEtoDocument): Promise<any> {
    return await this.httpClient.post<IEtoDocument>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_PATH,
    });
  }
  // REMOVE ANY!!

  public async getEtoFileStateInfo(): Promise<IHttpResponse<any>> {
    return await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_INFO_PATH,
    });
  }
  // TODO: Change Object type

  public async getAllEtoTemplates(): Promise<IHttpResponse<any>> {
    return await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETO_TEMPLATES_PATH,
    });
  }

  public async getEtoTemplate(etoDocument: IEtoDocument): Promise<IHttpResponse<any>> {
    return await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETO_TEMPLATES_PATH,
      queryParams: {
        documentType: etoDocument.documentType,
        input: JSON.stringify(etoDocument),
      },
    });
  }

  public async getSpecificEtoTemplate(
    etoId: string,
    etoDocument: IEtoDocument,
  ): Promise<IHttpResponse<any>> {
    return await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: `${etoId}/${ETO_TEMPLATES_PATH}/${etoDocument.documentType}`,
      queryParams: {
        input: JSON.stringify(etoDocument),
      },
    });
  }
}
