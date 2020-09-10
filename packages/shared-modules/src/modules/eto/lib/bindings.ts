import { ContainerModule } from "inversify";

import { TLibSymbolType } from "../../../types";
import { EtoApi } from "./http/eto-api/EtoApi";
import { EtoFileApi } from "./http/eto-api/EtoFileApi";
import { EtoNomineeApi } from "./http/eto-api/EtoNomineeApi";
import { EtoProductApi } from "./http/eto-api/EtoProductApi";
import { EtoTokensApi } from "./http/eto-api/EtoTokensApi";
import { symbols } from "./symbols";

export const setupContainerModule = () =>
  new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.etoApi>>(symbols.etoApi)
      .to(EtoApi)
      .inSingletonScope();
    bind<TLibSymbolType<typeof symbols.etoFileApi>>(symbols.etoFileApi)
      .to(EtoFileApi)
      .inSingletonScope();
    bind<TLibSymbolType<typeof symbols.etoProductApi>>(symbols.etoProductApi)
      .to(EtoProductApi)
      .inSingletonScope();
    bind<TLibSymbolType<typeof symbols.etoNomineeApi>>(symbols.etoNomineeApi)
      .to(EtoNomineeApi)
      .inSingletonScope();
    bind<TLibSymbolType<typeof symbols.etoTokensApi>>(symbols.etoTokensApi)
      .to(EtoTokensApi)
      .inSingletonScope();
  });
