import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";
import { IEtoDocument } from "./EtoFileApi.interfaces";

const BASE_PATH = "/api/eto-listing/etos";
const ETO_DOCUMENTS_PATH = "/me/documents";
const ETO_DOCUMENTS_INFO_PATH = "/me/documents/state_info";
const ETO_TEMPLATES_PATH = "/me/templates";
@injectable()
export class EtoFileApi {
  constructor(@inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient) {}

  public async getAllEtoDocuments(): Promise<IHttpResponse<any>> {
    const response = await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_PATH,
    });
    return response.body;
  }

  public async uploadEtoDocument(file: File, document: IEtoDocument): Promise<any> {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "document_data",
      JSON.stringify({
        mime_type: "application/pdf",
        document_type: document.documentType,
        ipfs_hash: document.ipfsHash,
        name: document.documentType,
        form: "document",
      }),
    );

    const response = await this.httpClient.post<IEtoDocument>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_PATH,
      formData: data,
    });
    return response.body;
  }
  // REMOVE ANY!!

  public async getEtoFileStateInfo(): Promise<IHttpResponse<any>> {
    const response = await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETO_DOCUMENTS_INFO_PATH,
    });
    return response.body;
  }
  // TODO: Change Object type

  public async getAllEtoTemplates(): Promise<IHttpResponse<any>> {
    const response = await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETO_TEMPLATES_PATH,
    });
    return response.body;
  }

  public async getEtoTemplate(etoDocument: IEtoDocument): Promise<IHttpResponse<any>> {
    const response = await this.httpClient.get<any>({
      baseUrl: BASE_PATH,
      url: `${ETO_TEMPLATES_PATH}/${etoDocument.documentType}`,
      skipResponseParsing: true,
    });
    return response.body;
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
