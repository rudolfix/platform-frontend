import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient } from "../client/IHttpClient";
import { TAnalyticsTransactionsResponse } from "./interfaces";

const ANALYTICS_API_ROOT = "/api/analytics-api";

@injectable()
export class AnalyticsApi {
  constructor(@inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient) {}

  /**
   * @method getTransactionsList An API method thats gets an initial transaction history list
   *
   * @note this shouldn't be used for data polling
   */
  getTransactionsList(
    limit: number,
    lastTransactionId?: string,
  ): Promise<TAnalyticsTransactionsResponse> {
    return this.httpClient
      .get<TAnalyticsTransactionsResponse>({
        baseUrl: ANALYTICS_API_ROOT,
        url: `/transactions/me`,
        queryParams: {
          limit,
          before_transaction: lastTransactionId,
        },
      })
      .then(r => r.body);
  }

  /**
   * @method getTransactionsList An API method thats returns an updated transaction list
   *
   * @note this should be used for data polling
   */
  getUpdatedTransactions(timestampOfLastChange: number): Promise<TAnalyticsTransactionsResponse> {
    return this.httpClient
      .get<TAnalyticsTransactionsResponse>({
        baseUrl: ANALYTICS_API_ROOT,
        url: `/transactions/new/me`,
        queryParams: {
          after_version: timestampOfLastChange,
        },
      })
      .then(r => r.body);
  }
}
