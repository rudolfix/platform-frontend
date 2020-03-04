import { coreModuleApi, TLibSymbolType } from "@neufund/shared-modules";
import { AppStorage } from "./classes/AppStorage";
import { AsyncStorageProvider } from "./classes/AsyncStorageProvider";
import { symbols } from "./symbols";
import { ContainerModule } from "inversify";
import * as yup from "yup";
import { StorageSchema } from "./classes/StorageSchema";
import { AppSingleKeyStorage } from "./classes/AppSingleKeyStorage";

// TODO: this is a dummy mock. Replace with real storage. e.g. WalletStorage
const PersonSchema = yup.object().shape({
  name: yup.string(),
  age: yup.number(),
});

// get a type for TS from Yup object
type Person = yup.InferType<typeof PersonSchema>;

const personSchema = new StorageSchema(1, "PersonSchema", PersonSchema);

// TODO: this is a dummy mock. Replace with real storage. e.g. WalletStorage
const WalletSchema = yup.object().shape({
  wallets: yup.array(),
});

// get a type for TS from Yup object
type Wallet = yup.InferType<typeof WalletSchema>;

const walletSchema = new StorageSchema(1, "WalletSchema", WalletSchema);

export function setupBindings(): ContainerModule {
  return new ContainerModule(bind => {
    bind<AppStorage<Person>>(symbols.appStorage).toDynamicValue(
      ctx =>
        new AppStorage(
          ctx.container.get(symbols.appStorageProvider),
          ctx.container.get(coreModuleApi.symbols.logger),
          "testStorage",
          personSchema,
        ),
    );
    bind<AppSingleKeyStorage<Wallet>>(symbols.singleKeyAppStorage).toDynamicValue(
      ctx =>
        new AppSingleKeyStorage(
          ctx.container.get(symbols.appStorageProvider),
          ctx.container.get(coreModuleApi.symbols.logger),
          "activeWallet",
          walletSchema,
        ),
    );
    bind<TLibSymbolType<typeof symbols.appStorageProvider>>(symbols.appStorageProvider)
      .to(AsyncStorageProvider)
      .inSingletonScope();
  });
}
