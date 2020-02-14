import { ContainerModule } from "inversify";

import { BinaryHttpClient } from "./client/BinaryHttpClient";
import { IHttpClient } from "./client/IHttpClient";
import { ILogger, Logger } from "./logger/index";
import { symbols } from "./symbols";

export function setupContainerModule(backendRootUrl: string): ContainerModule {
  return new ContainerModule(bind => {
    bind<string>(symbols.backendRootUrl).toConstantValue(backendRootUrl);

    bind<ILogger>(symbols.logger)
      .to(Logger)
      .inSingletonScope();

    bind<IHttpClient>(symbols.binaryHttpClient)
      .to(BinaryHttpClient)
      .inSingletonScope();
  });
}
