import { injectable } from "inversify";
import { compact } from "lodash";
import * as queryString from "query-string";
import * as urlJoin from "url-join";
import { Dictionary } from "../../../types";
import {
  HttpMethod,
  IHttpClient,
  IHttpClientErrorDocument,
  IHttpGetRequest,
  IHttpPostRequest,
  IHttpRequestCommon,
  IHttpResponse,
} from "./IHttpClient";

export class HttpClientError extends Error {
  protected type: string;
  protected details: IHttpClientErrorDocument;
  constructor(
    instance: string,
    type: string = "HTTPClientError",
    title: string = "There was an error connecting to the network",
    status: number = 0,
  ) {
    super();
    this.type = type;
    this.details = {
      type,
      status,
      title,
      instance,
    };
  }
}

export class ResponseParsingError extends HttpClientError {
  constructor(instance: string) {
    super(instance, "ResponseParsingError", "There was an error parsing the result of the server");
  }
}

export class ResponseStatusError extends HttpClientError {
  constructor(instance: string, public readonly status: number) {
    super(instance, "ResponseStatusError", "There was an error connecting to the network", status);
  }
}

export class NetworkingError extends HttpClientError {
  constructor(instance: string) {
    super(instance, "NetworkingError", "There was an error connecting to the network");
  }
}

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

  public put<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    const urlParts = compact([config.baseUrl, config.url]);
    const fullUrl = urlJoin(...urlParts);

    return this.makeFetchRequest<T>(fullUrl, "PUT", config);
  }

  public patch<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>> {
    const urlParts = compact([config.baseUrl, config.url]);
    const fullUrl = urlJoin(...urlParts);

    return this.makeFetchRequest<T>(fullUrl, "PATCH", config);
  }

  public delete(config: IHttpPostRequest): Promise<IHttpResponse<any>> {
    const urlParts = compact([config.baseUrl, config.url]);
    const fullUrl = urlJoin(...urlParts);

    return this.makeFetchRequest<any>(fullUrl, "DELETE", config);
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
      throw new NetworkingError(fullUrl);
    }

    if (!response.ok) {
      throw new ResponseStatusError(fullUrl, response.status);
    }

    let responseJson: any = {};
    if (response.body) {
      responseJson = await response.json().catch(() => {
        throw new ResponseParsingError("Response is not a json");
      });
    }

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
