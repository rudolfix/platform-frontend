import { authModuleAPI, coreModuleApi, IHttpClient } from "@neufund/shared-modules";
import { inject, injectable } from "inversify";

import {
  FileDescriptionValidator,
  TFileDescription,
  TFileType,
} from "../file-storage/FileStorage.interfaces";
import { IImmutableFileId } from "./ImmutableStorage.interfaces";

const BASE_PATH = "/api/immutable-storage";
const DOWNLOAD_DOCUMENT_PATH = "/download/";
const UPLOAD_DOCUMENT_PATH = "/upload";

@injectable()
export class ImmutableStorageApi {
  constructor(
    @inject(authModuleAPI.symbols.authJsonHttpClient) private httpClient: IHttpClient,
    @inject(coreModuleApi.symbols.binaryHttpClient) private binaryHttpClient: IHttpClient,
    @inject(authModuleAPI.symbols.authBinaryHttpClient) private authBinaryHttpClient: IHttpClient,
  ) {}

  /**
   * Uploads file to the IPFS through backend
   */
  public async uploadFile(mime_type: TFileType, file: File): Promise<TFileDescription> {
    const data = new FormData();
    data.append("file", file);

    const response = await this.httpClient.post<TFileDescription>({
      baseUrl: BASE_PATH,
      url: UPLOAD_DOCUMENT_PATH + `?declared_mime_type=${mime_type}`,
      formData: data,
      responseSchema: FileDescriptionValidator,
    });

    return response.body;
  }

  /**
   * Downloads unprotected files (without JWT token) from the IPFS through backend
   */
  public async getFile({
    ipfsHash,
    mimeType,
    placeholders,
    asPdf,
  }: IImmutableFileId): Promise<TFileDescription> {
    const placeHolder = placeholders ? JSON.stringify(placeholders) : "";
    const response = await this.binaryHttpClient.get<TFileDescription>({
      baseUrl: BASE_PATH,
      url: DOWNLOAD_DOCUMENT_PATH + ipfsHash,
      queryParams: {
        mime_type: mimeType,
        placeholders: placeHolder,
        as_pdf: asPdf,
      },
    });
    return response.body;
  }

  /**
   * Downloads protected files from the IPFS through backend
   */
  public async getProtectedFile({
    ipfsHash,
    mimeType,
    placeholders,
    asPdf,
  }: IImmutableFileId): Promise<TFileDescription> {
    const placeHolder = placeholders ? JSON.stringify(placeholders) : "";
    const response = await this.authBinaryHttpClient.get<TFileDescription>({
      baseUrl: BASE_PATH,
      url: DOWNLOAD_DOCUMENT_PATH + ipfsHash,
      queryParams: {
        mime_type: mimeType,
        placeholders: placeHolder,
        as_pdf: asPdf,
      },
    });
    return response.body;
  }
}
