import { ContainerModule } from "inversify";

import { TLibSymbolType } from "../../types";
import { EtoPledgeApi } from "./lib/http/eto-pledge-api/EtoPledgeApi";
import { symbols } from "./symbols";

export const setupContainerModule = () =>
  new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.etoPledgeApi>>(symbols.etoPledgeApi)
      .to(EtoPledgeApi)
      .inSingletonScope();
  });
