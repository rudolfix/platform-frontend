import {ContainerModule} from "inversify";
import {Notifications} from "./Notifications";
import {TLibSymbolType} from "@neufund/shared-modules";
import {symbols} from "./symbols";
import {FirebaseProvider} from "./FirebaseProvider";


export function setupBindings(): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.notifications>>(symbols.notifications)
      .to(Notifications)
      .inSingletonScope();

    bind<TLibSymbolType<typeof symbols.notificationsProvider>>(symbols.notificationsProvider)
      .to(FirebaseProvider)
      .inSingletonScope();
  });
}
