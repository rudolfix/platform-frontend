import { inject, injectable } from "inversify";

import { TLibSymbolType } from "../../../types";
import { coreModuleApi } from "../../core/module";

@injectable()
export class MarketingEmailsApi {
  constructor(
    @inject(coreModuleApi.symbols.binaryHttpClient)
    private httpClient: TLibSymbolType<typeof coreModuleApi.symbols.binaryHttpClient>,
  ) {}

  public async unsubscribeMarketingEmails(link: string): Promise<void> {
    await this.httpClient.get<void>({
      url: link,
    });
  }
}
