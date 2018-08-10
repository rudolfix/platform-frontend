import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import {} from "../../utils/transformObjectKeys";
import { IHttpClient, IHttpResponse } from "./client/IHttpClient";
import { FileDescriptionValidator, TFileDescription, TFileType } from "./FileStorage.interfaces";
import { ImmutableFileId } from "./ImmutableStorage.interfaces";

const BASE_PATH = "/api/immutable-storage";
const DOWNLOAD_DOCUMENT_PATH = "/download/";
const UPLOAD_DOCUMENT_PATH = "/upload";

@injectable()
export class ImmutableStorageApi {
  constructor(
    @inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.authorizedBinaryHttpClient) private binaryHttpClient: IHttpClient,
  ) {}

  public async uploadFile(
    mime_type: TFileType,
    file: File,
  ): Promise<IHttpResponse<TFileDescription>> {
    const data = new FormData();
    data.append("file", file);

    const response = await this.httpClient.post<TFileDescription>({
      baseUrl: BASE_PATH,
      url: UPLOAD_DOCUMENT_PATH + `?declared_mime_type=${mime_type}`,
      formData: data,
      responseSchema: FileDescriptionValidator,
    });
    return response;
  }

  public async getFile({
    ipfsHash,
    mimeType,
    placeholders,
    asPdf,
  }: ImmutableFileId): Promise<IHttpResponse<TFileDescription>> {
    const placeHolder = placeholders ? JSON.stringify(placeholders) : "";
    return await this.binaryHttpClient.get<any>({
      baseUrl: BASE_PATH,
      url: DOWNLOAD_DOCUMENT_PATH + ipfsHash,
      queryParams: {
        mime_type: mimeType,
        placeholders: placeHolder,
        as_pdf: asPdf.toString(),
      },
    });
  }
}
