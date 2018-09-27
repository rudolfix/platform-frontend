/**
 * Wraps fetch with JSON based, injectable wrapper.
 *
 * Converts camel cased body properties to snake case on requests,
 * and does the reverse on responses.
 *
 * It supports validating response shape. Validation happens AFTER camelCasing.
 */

import { injectable } from "inversify";
import { Dictionary } from "../../../types";
import { toCamelCase } from "../../../utils/transformObjectKeys";
import { HttpClient, ResponseParsingError } from "./HttpClient";
import { HttpMethod, IHttpRequestCommon, IHttpResponse } from "./IHttpClient";

//supports only JSON apis
@injectable()
export class JsonHttpClient extends HttpClient {
  protected readonly requestHeaders: Dictionary<string> = {
    Accept: "application/json, text/plain",
    "Content-Type": "application/json",
  };

  protected readonly formDataRequestHeaders: Dictionary<string> = {
    Accept: "application/json, text/plain",
  };

  protected async makeFetchRequest<T>(
    fullUrl: string,
    method: HttpMethod,
    config: IHttpRequestCommon,
  ): Promise<IHttpResponse<T>> {
    let response;
    response = await this.makeRequest(fullUrl, method, config);

    let responseJson: any = {};

    if (!config.expectsNoResponse) {
      responseJson = await response.json().catch(() => {
        throw new ResponseParsingError("Response is not a json");
      });
    }

    let finalResponseJson: T = config.skipResponseParsing
      ? responseJson
      : toCamelCase(responseJson);
    if (config.responseSchema && response.ok && !config.skipResponseParsing) {
      // we dont validate response on non success statuses
      try {
        finalResponseJson = config.responseSchema.validateSync(toCamelCase(responseJson), {
          stripUnknown: true,
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
