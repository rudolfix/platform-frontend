import { ContainerModule } from "inversify";

import { MarketingEmailsApi } from "./MarketingEmailsApi";
import { symbols } from "./symbols";

export function setupContainerModule(): ContainerModule {
  return new ContainerModule(bind => {
    bind<MarketingEmailsApi>(symbols.marketingEmailsApi)
      .to(MarketingEmailsApi)
      .inSingletonScope();
  });
}
