/**
 * Wraps fetch with JSON based, injectable wrapper.
 *
 * Converts camel cased body properties to snake case on requests,
 * and does the reverse on responses.
 *
 * It supports validating response shape. Validation happens AFTER camelCasing.
 */

import { Dictionary, toCamelCase } from "@neufund/shared-utils";
import { injectable } from "inversify";
import * as Yup from "yup";

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
    const response = await this.makeRequest(fullUrl, method, config);

    let responseJson: any = {};

    if (!config.expectsNoResponse) {
      responseJson = await response.json().catch(() => {
        throw new ResponseParsingError(fullUrl, "Response is not a json");
      });
    }

    let finalResponseJson: T = config.skipResponseParsing
      ? responseJson
      : toCamelCase(responseJson);

    // we dont validate response on non success statuses
    if (config.responseSchema && response.ok && !config.skipResponseParsing) {
      try {
        finalResponseJson = this.validateResponseSchema(config.responseSchema, responseJson);
      } catch (e) {
        throw new ResponseParsingError(fullUrl, e.message);
      }
    }

    return {
      statusCode: response.status,
      body: finalResponseJson,
    };
  }

  private validateResponseSchema<T>(schema: Yup.Schema<T>, response: T): T {
    return schema.validateSync(toCamelCase(response), {
      stripUnknown: true,
    });
  }
}
