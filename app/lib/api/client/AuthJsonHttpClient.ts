/**
 * Wraps fetch with JSON based, injectable wrapper
 * Converts camel cased body properties to snake case on requests,
 * and does the reverse on responses
 */
import { symbols } from "../../../di/symbols";

import { inject, injectable } from "inversify";
import { ObjectStorage } from "../../persistence/ObjectStorage";
import {
  IHttpClient,
  IHttpGetRequest,
  IHttpPostRequest,
  IHttpRequestCommon,
  IHttpResponse,
} from "./IHttpClient";

//supports only JSON apis
@injectable()
export class AuthorizedJsonHttpClient implements IHttpClient {
  constructor(
    @inject(symbols.jwtStorage) private objectStorage: ObjectStorage<string>,
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
  ) {}

  private insertAuthHeader<T extends IHttpRequestCommon>(config: any): T {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${this.objectStorage.get()}`,
      },
    };
  }

  public async get<T>(config: IHttpGetRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.get<T>(this.insertAuthHeader(config));
  }

  public async post<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.post<T>(this.insertAuthHeader(config));
  }

  public async put<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.put<T>(this.insertAuthHeader(config));
  }

  public async patch<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.patch<T>(this.insertAuthHeader(config));
  }

  public async delete(config: IHttpPostRequest): Promise<IHttpResponse<any>> {
    return this.httpClient.delete(this.insertAuthHeader(config));
  }
}
