import { TLibSymbolType } from "@neufund/shared-modules";
import { ContainerModule } from "inversify";
import { privateSymbols } from "./symbols";
import { walletConnectManagerFactory } from "./WalletConnectManager";

export function setupBindings(): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof privateSymbols.walletConnectManagerFactory>>(
      privateSymbols.walletConnectManagerFactory,
    ).toFactory(walletConnectManagerFactory);
  });
}
