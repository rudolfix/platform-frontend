import { ContainerModule } from "inversify";

import { TLibSymbolType } from "../../types";
import { EtoApi } from "./lib/http/eto-api/EtoApi";
import { EtoFileApi } from "./lib/http/eto-api/EtoFileApi";
import { EtoNomineeApi } from "./lib/http/eto-api/EtoNomineeApi";
import { EtoProductApi } from "./lib/http/eto-api/EtoProductApi";
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
  });
