import { injectable } from "inversify";
import { compact } from "lodash";
import * as queryString from "query-string";
import * as urlJoin from "url-join";
import { Dictionary } from "../../types";
import {
  HttpMethod,
  IHttpClient,
  IHttpGetRequest,
  IHttpPostRequest,
  IHttpRequestCommon,
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

export const JsonHttpClientSymbol = "JsonHttpClient";

//supports only JSON apis
@injectable()
export class JsonHttpClient implements IHttpClient {
  private readonly defaultHeaders: Dictionary<string> = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  };

  public async get<T>(config: IHttpGetRequest): Promise<IHttpResponse<T>> {
    const qs = config.queryParams ? "?" + queryString.stringify(config.queryParams) : null;
    // we need to remove falsy values because urlJoin is retarded and ads trailing slashes otherwise
    const urlParts = compact([config.baseUrl, config.url, qs]);
    const fullUrl = urlJoin(...urlParts);

    return this.makeFetchRequest<T>(fullUrl, "GET", config);
  }

  public post<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    const urlParts = compact([config.baseUrl, config.url]);
    const fullUrl = urlJoin(...urlParts);

    return this.makeFetchRequest<T>(fullUrl, "POST", config);
  }

  private async makeFetchRequest<T>(
    fullUrl: string,
    method: HttpMethod,
    config: IHttpRequestCommon,
  ): Promise<IHttpResponse<T>> {
    let response;
    try {
      response = await fetch(fullUrl, {
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
        method: method,
        body: "body" in config ? JSON.stringify(config.body) : undefined,
      });
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
}
