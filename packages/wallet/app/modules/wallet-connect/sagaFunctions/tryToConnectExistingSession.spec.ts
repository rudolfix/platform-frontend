import { matchers } from "@neufund/sagas/tests";
import {
  coreModuleApi,
  DevConsoleLogger,
  noopLogger,
  setupCoreModule,
  TLibSymbolType,
} from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";

import { setupStorageModule } from "modules/storage/module";
import { WalletConnectAdapter } from "modules/wallet-connect/lib/WalletConnectAdapter";
import { privateSymbols } from "modules/wallet-connect/lib/symbols";
import { setupWalletConnectModule } from "modules/wallet-connect/module";

import { createMock } from "utils/testUtils.specUtils";

import { connectEvents } from "./connectEvents";
import { tryToConnectExistingSession } from "./tryToConnectExistingSession";

const setupTest = () => {
  const { container, expectSaga } = bootstrapModule([
    setupCoreModule({ backendRootUrl: "" }),
    setupStorageModule(),
    setupWalletConnectModule(),
  ]);

  const walletConnectManager = container.get<
    TLibSymbolType<typeof privateSymbols.walletConnectManager>
  >(privateSymbols.walletConnectManager);

  const loggerMock = createMock(DevConsoleLogger, noopLogger);

  container
    .rebind<TLibSymbolType<typeof coreModuleApi.symbols.logger>>(coreModuleApi.symbols.logger)
    .toConstantValue(loggerMock);

  return {
    walletConnectManager,
    expectSaga,
    logger: loggerMock,
  };
};

describe("wallet-connect - tryToConnectExistingSession", () => {
  it("should connect to existing session", async () => {
    const { expectSaga, walletConnectManager } = setupTest();

    const mockWCAdapter = createMock(WalletConnectAdapter, {});

    await expectSaga(tryToConnectExistingSession)
      .provide([
        [matchers.call.fn(walletConnectManager.hasExistingSession), Promise.resolve(true)],
        [matchers.call.fn(walletConnectManager.useExistingSession), Promise.resolve(mockWCAdapter)],
        [matchers.call.fn(connectEvents), undefined],
      ])
      .call.fn(connectEvents)
      .run();
  });

  it("should not connect to existing session", async () => {
    const { expectSaga, walletConnectManager } = setupTest();

    await expectSaga(tryToConnectExistingSession)
      .provide([
        [matchers.call.fn(walletConnectManager.hasExistingSession), Promise.resolve(false)],
      ])
      .not.call.fn(connectEvents)
      .run();
  });

  it("should catch errors without rethrowing", async () => {
    const { expectSaga, walletConnectManager, logger } = setupTest();

    const error = new Error("Failed to check existing session");

    await expectSaga(tryToConnectExistingSession)
      .provide({
        call(effect, next) {
          if (effect.fn === walletConnectManager.hasExistingSession) {
            throw error;
          }

          return next();
        },
      })
      .not.call.fn(connectEvents)
      .not.throws(Error)
      .run();

    expect(logger.error).toHaveBeenCalledWith(error, expect.any(String));
  });
});
