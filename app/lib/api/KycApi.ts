import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { IHttpClient, IHttpResponse } from "./client/IHttpClient";

import {
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
  KycFileInfoShape,
  KycIndividudalDataSchema,
  KycLegalRepresentativeSchema,
  KycRequestStateSchema,
} from "./KycApi.interfaces";

const BASE_PATH = "/api/kyc/";
const INDIVIDUAL_DATA_PATH = "/individual/data";
const INDIVIDUAL_REQUEST_PATH = "/individual/request";
const INDIVIDUAL_DOCUMENT_PATH = "/individual/document";

const BUSINESS_REQUEST_PATH = "/business/request";
const BUSINESS_DATA_PATH = "/business/data";
const BUSINESS_DOCUMENT_PATH = "/business/document";
const LEGAL_REPRESENTATIVE_PATH = "/business/legal-representative";
const LEGAL_REPRESENTATIVE_DOCUMENT_PATH = "/business/legal-representative/document";

/**
 *
 *
 * @export
 * @class KycApi
 */
@injectable()
export class KycApi {
  // tslint:disable-next-line
  constructor(@inject(symbols.authorizedHttpClient) private httpClient: IHttpClient) {}
  // tslint:disable-next-line

  /**
   * Individual Requests
   */
  // data
  public async getIndividualData(): Promise<IHttpResponse<IKycBusinessData>> {
    return await this.httpClient.get<IKycBusinessData>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DATA_PATH,
      responseSchema: KycIndividudalDataSchema,
    });
  }

  public async putIndividualData(
    data: IKycIndividualData,
  ): Promise<IHttpResponse<IKycIndividualData>> {
    return await this.httpClient.put<IKycIndividualData>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DATA_PATH,
      body: data,
      responseSchema: KycIndividudalDataSchema,
    });
  }

  // documents
  public async getIndividualDocuments(): Promise<IHttpResponse<IKycFileInfo[]>> {
    return await this.httpClient.get<IKycFileInfo[]>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DOCUMENT_PATH,
    });
  }

  public async uploadIndividualDocument(file: File): Promise<IHttpResponse<IKycFileInfo>> {
    let data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<IKycFileInfo>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DOCUMENT_PATH,
      formData: data,
      responseSchema: KycFileInfoShape,
    });
  }

  // request
  public async getIndividualRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.get<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_REQUEST_PATH,
      responseSchema: KycRequestStateSchema,
    });
  }

  public async submitIndividualRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.put<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_REQUEST_PATH,
      responseSchema: KycRequestStateSchema,
    });
  }

  /**
   * Business requests
   */

  // legal representative
  public async getLegalRepresentative(): Promise<IHttpResponse<IKycLegalRepresentative>> {
    return await this.httpClient.get<IKycLegalRepresentative>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_PATH,
      responseSchema: KycLegalRepresentativeSchema,
    });
  }

  public async putLegalRepresentative(
    data: IKycLegalRepresentative,
  ): Promise<IHttpResponse<IKycLegalRepresentative>> {
    return await this.httpClient.put<IKycLegalRepresentative>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_PATH,
      body: data,
      responseSchema: KycLegalRepresentativeSchema,
    });
  }

  public async getLegalRepresentativeDocuments(): Promise<IHttpResponse<IKycFileInfo[]>> {
    return await this.httpClient.get<IKycFileInfo[]>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_DOCUMENT_PATH,
    });
  }

  public async uploadLegalRepresentativeDocument(file: File): Promise<IHttpResponse<IKycFileInfo>> {
    let data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<IKycFileInfo>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_DOCUMENT_PATH,
      formData: data,
      responseSchema: KycFileInfoShape,
    });
  }

  // data
  public async getBusinessData(): Promise<IHttpResponse<IKycBusinessData>> {
    return await this.httpClient.get<IKycBusinessData>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DATA_PATH,
    });
  }

  public async putBusinessData(data: IKycBusinessData): Promise<IHttpResponse<IKycBusinessData>> {
    return await this.httpClient.put<IKycBusinessData>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DATA_PATH,
      body: data,
    });
  }

  public async getBusinessDocuments(): Promise<IHttpResponse<IKycFileInfo[]>> {
    return await this.httpClient.get<IKycFileInfo[]>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DOCUMENT_PATH,
    });
  }

  public async uploadBusinessDocument(file: File): Promise<IHttpResponse<IKycFileInfo>> {
    let data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<IKycFileInfo>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DOCUMENT_PATH,
      formData: data,
      responseSchema: KycFileInfoShape,
    });
  }

  // beneficial owners
  // @TODO

  // request
  public async getBusinessRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.get<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: BUSINESS_REQUEST_PATH,
      responseSchema: KycRequestStateSchema,
    });
  }

  public async submitBusinessRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.put<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: BUSINESS_REQUEST_PATH,
      responseSchema: KycRequestStateSchema,
    });
  }
}
