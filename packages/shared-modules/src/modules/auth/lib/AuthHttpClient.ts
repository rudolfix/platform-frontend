import { injectable } from "inversify";

import {
  IHttpClient,
  IHttpGetRequest,
  IHttpPostRequest,
  IHttpRequestCommon,
  IHttpResponse,
  ISingleKeyStorage,
} from "../../core/module";

/**
 * Wraps the general http api with authorization header injection
 * collected from provided storage
 */
@injectable()
export abstract class AuthHttpClient implements IHttpClient {
  protected abstract httpClient: IHttpClient;
  protected abstract jwtStorage: ISingleKeyStorage<string>;

  private async insertAuthHeader<T extends IHttpRequestCommon>(config: T): Promise<T> {
    const JWT = await this.jwtStorage.get();

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${JWT}`,
        /*
         * Additional custom header required due authorization issues on iOS12/Safari
         * https://github.com/Neufund/platform-frontend/issues/2425
         */
        "X-NF-Authorization": `Bearer ${JWT}`,
      },
    };
  }

  public async get<T>(config: IHttpGetRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.get<T>(await this.insertAuthHeader(config));
  }

  public async post<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.post<T>(await this.insertAuthHeader(config));
  }

  public async put<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.put<T>(await this.insertAuthHeader(config));
  }

  public async patch<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    return this.httpClient.patch<T>(await this.insertAuthHeader(config));
  }

  public async delete(config: IHttpPostRequest): Promise<IHttpResponse<any>> {
    return this.httpClient.delete(await this.insertAuthHeader(config));
  }
}
