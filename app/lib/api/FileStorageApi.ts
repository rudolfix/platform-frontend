import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { IHttpClient, IHttpResponse } from "./client/IHttpClient";
import { FileDescriptionValidator, TFileDescription, TFileType } from "./FileStorage.interfaces";

const BASE_PATH = "/api/document-storage/";
const DOCUMENTS_PATH = "/documents";

@injectable()
export class FileStorageApi {
  constructor(@inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient) {}

  public async uploadFile(type: TFileType, file: File): Promise<IHttpResponse<TFileDescription>> {
    const data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<TFileDescription>({
      baseUrl: BASE_PATH,
      url: DOCUMENTS_PATH + `?type=${type}`,
      formData: data,
      responseSchema: FileDescriptionValidator,
    });
  }

  /**
   * Here we need fileId — not full url
   */
  public async getFile(fileId: string): Promise<IHttpResponse<TFileDescription>> {
    return await this.httpClient.get<TFileDescription>({
      baseUrl: BASE_PATH,
      url: DOCUMENTS_PATH,
      queryParams: {
        file_path: fileId,
      },
      responseSchema: FileDescriptionValidator,
    });
  }
}
