import * as Yup from "yup";
import { Dictionary } from "../../types";

interface IHttpRequestCommon {
  url: string;
  baseUrl?: string;
  responseSchema?: Yup.Schema;
}

export interface IHttpGetRequest extends IHttpRequestCommon {
  // method: "GET";
  queryParams?: Dictionary<string>;
}

export interface IHttpPostRequest extends IHttpRequestCommon {
  method: "POST";
  body: object;
}

export type HttpRequestConfig =
  | ({ method: "GET" } & IHttpGetRequest)
  | ({ method: "POST" } & IHttpPostRequest);

export interface IHttpResponse<T> {
  body: T;
  statusCode: number;
}

export interface IHttpClient {
  request<T>(config: HttpRequestConfig): Promise<IHttpResponse<T>>;
  get<T>(config: IHttpGetRequest): Promise<IHttpResponse<T>>;
  post<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>>;
}
