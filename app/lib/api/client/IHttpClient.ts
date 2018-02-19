import * as Yup from "yup";
import { Dictionary } from "../../../types";

export type HttpMethod = "GET" | "POST";

export interface IHttpRequestCommon {
  url: string;
  baseUrl?: string;
  responseSchema?: Yup.Schema;
  headers?: Dictionary<string>;
  body?: any;
}

export interface IHttpGetRequest extends IHttpRequestCommon {
  queryParams?: Dictionary<string>;
}

export interface IHttpPostRequest extends IHttpRequestCommon {}

export interface IHttpResponse<T> {
  body: T;
  statusCode: number;
}

export interface IHttpClient {
  get<T>(config: IHttpGetRequest): Promise<IHttpResponse<T>>;
  post<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>>;
}
