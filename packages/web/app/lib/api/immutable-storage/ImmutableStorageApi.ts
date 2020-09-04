import {
  AuthHttpClient,
  authModuleAPI,
  coreModuleApi, IAuthHttpClient,
  IHttpClient,
  ISingleKeyStorage
} from "@neufund/shared-modules";
import { inject, injectable } from "inversify";

import {
  FileDescriptionValidator,
  TFileDescription,
  TFileType,
} from "../file-storage/FileStorage.interfaces";
import { IImmutableFileId } from "./ImmutableStorage.interfaces";

const BASE_PATH = "/api/immutable-storage";
const DOWNLOAD_DOCUMENT_PATH = "/download/";
const UPLOAD_DOCUMENT_PATH = "/documents";

@injectable()
export class ImmutableStorageApi {
  constructor(
    @inject(authModuleAPI.symbols.authJsonHttpClient) private httpClient: IAuthHttpClient,
    @inject(coreModuleApi.symbols.binaryHttpClient) private binaryHttpClient: IHttpClient,
    @inject(authModuleAPI.symbols.authBinaryHttpClient) private authBinaryHttpClient: IHttpClient,
    @inject(authModuleAPI.symbols.jwtStorage) private jwtStorage: ISingleKeyStorage<string>,
  ) {}

  /**
   * Uploads file to the IPFS through backend
   */
  public async uploadFile(mime_type: TFileType, file: File): Promise<TFileDescription> {
    const jwtFromStorage = await this.jwtStorage.get();
    console.log({jwtFromStorage});
    const data = new FormData();
    data.append("file", file);
    data.append("meta_string", "");

    const response = await this.httpClient.post<TFileDescription>({
      baseUrl: BASE_PATH,
      url: UPLOAD_DOCUMENT_PATH,
      formData: data,
      responseSchema: FileDescriptionValidator,
    });

    return response.body;
  }

  /**
   * Downloads files from the IPFS through backend. Sends authed request if jwt is present
   */
  public async getFile({
    ipfsHash,
    mimeType,
    placeholders,
    asPdf,
  }: IImmutableFileId): Promise<TFileDescription> {
    const jwtFromStorage = await this.jwtStorage.get();
    const httpClient =
      jwtFromStorage === undefined ? this.binaryHttpClient : this.authBinaryHttpClient;

    const placeHolder = placeholders ? JSON.stringify(placeholders) : "";
    const query = {
      baseUrl: BASE_PATH,
      url: DOWNLOAD_DOCUMENT_PATH + ipfsHash,
      queryParams: {
        mime_type: mimeType,
        placeholders: placeHolder,
        as_pdf: asPdf,
      },
    };

    const response = await httpClient.get<TFileDescription>(query);
    return response.body;
  }
}
