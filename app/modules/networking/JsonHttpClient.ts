import { compact } from "lodash";
import * as queryString from "query-string";
import * as urlJoin from "url-join";
import {
  HttpRequestConfig,
  IHttpClient,
  IHttpGetRequest,
  IHttpPostRequest,
  IHttpResponse,
} from "./IHttpClient";

export class HttpClientError extends Error {}
export class ResponseParsingError extends HttpClientError {
  public readonly type = "ResponseParsingError";
}
export class ResponseStatusError extends HttpClientError {
  public readonly type = "ResponseStatusError";
  constructor(public readonly statusCode: number) {
    super();
  }
}
export class NetworkingError extends HttpClientError {
  public readonly type = "NetworkingError";
}

//supports only JSON apis
export class JsonHttpClient implements IHttpClient {
  public async get<T>(config: IHttpGetRequest): Promise<IHttpResponse<T>> {
    const qs = config.queryParams ? "?" + queryString.stringify(config.queryParams) : null;
    const fullUrl = urlJoin(...compact([config.baseUrl, config.url, qs])); // we need to remove falsy values because urlJoin is retarded and ads trailing slashes otherwise

    let response;
    try {
      response = await fetch(fullUrl);
    } catch {
      throw new NetworkingError();
    }

    if (!response.ok) {
      throw new ResponseStatusError(response.status);
    }

    const responseJson = await response.json().catch(() => {
      throw new ResponseParsingError("Response is not a json");
    });

    let finalResponseJson: T = responseJson;
    if (config.responseSchema) {
      try {
        finalResponseJson = config.responseSchema.validateSync<T>(responseJson, {
          stripUnknown: true,
          strict: true,
        }) as T;
      } catch (e) {
        throw new ResponseParsingError(e.message);
      }
    }

    return {
      statusCode: response.status,
      body: finalResponseJson,
    };
  }

  request<T>(_config: HttpRequestConfig): Promise<IHttpResponse<T>> {
    throw new Error("Method not implemented.");
  }

  post<T>(_config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    throw new Error("Method not implemented.");
  }
}
