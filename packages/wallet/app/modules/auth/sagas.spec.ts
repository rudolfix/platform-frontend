/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { matchers, providers } from "@neufund/sagas/tests";
import {
  authModuleAPI,
  EUserType,
  EWalletSubType as EUserWalletSubType,
  setupCoreModule,
  TLibSymbolType,
  EWalletType as EUserWalletType,
} from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";
import {
  toEthereumChecksumAddress,
  secondsToMs,
  unixTimestampToTimestamp,
} from "@neufund/shared-utils";
import { setupFakeClock } from "@neufund/shared-utils/tests";

import { setupBiometricsModule } from "modules/biometrics/module";
import { EWalletType, setupWalletEthModule, walletEthModuleApi } from "modules/eth/module";

import { authActions } from "./actions";
import { EAuthState, setupAuthModule } from "./module";
import { authSaga } from "./sagas";
import {
  selectAuthLostWallet,
  selectAuthState,
  selectAuthWallet,
  selectIsStateChangeInProgress,
} from "./selectors";

export const BACKEND_BASE_URL = "foo";
export const NODE_BASE_URL = "bar";

const setupContextForTests = () => {
  const { expectSaga, container, getState } = bootstrapModule([
    setupCoreModule({ backendRootUrl: BACKEND_BASE_URL }),
    setupBiometricsModule(),
    ...setupWalletEthModule({
      rpcUrl: NODE_BASE_URL,
    }),
    ...setupAuthModule(BACKEND_BASE_URL),
  ]);

  const ethManager = container.get<TLibSymbolType<typeof walletEthModuleApi.symbols.ethManager>>(
    walletEthModuleApi.symbols.ethManager,
  );

  return { expectSaga, ethManager, getState };
};

const authWalletMetadata = {
  walletType: EUserWalletType.MOBILE,
  walletSubType: EUserWalletSubType.NEUFUND,
};

const walletMetadata = {
  name: "Fixture name",
  address: toEthereumChecksumAddress("0x429123b08DF32b0006fd1F3b0Ef893A8993802f3"),
  type: EWalletType.HD_WALLET,
};

describe("Auth sagas", () => {
  describe("createNewAccount", () => {
    it("should create new account", async () => {
      const { expectSaga, ethManager, getState } = setupContextForTests();

      const initialState = getState();
      expect(selectAuthState(initialState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(initialState)).toBeUndefined();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.plugNewRandomWallet), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
        ])
        .dispatch(authActions.createAccount())

        .call.fn(ethManager.plugNewRandomWallet)
        .call.fn(authModuleAPI.sagas.createJwt)
        .call(authModuleAPI.sagas.loadOrCreateUser, {
          walletMetadata: authWalletMetadata,
          userType: EUserType.INVESTOR,
        })

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.AUTHORIZED);
      expect(selectAuthWallet(storeState)).toEqual(walletMetadata);
    });

    it("should remove lost wallet if there is one", async () => {
      const { expectSaga, ethManager } = setupContextForTests();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.plugNewRandomWallet), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
          [matchers.call.fn(ethManager.unsafeDeleteLostWallet), undefined],
        ])
        .dispatch(authActions.accountLost(walletMetadata))
        .dispatch(authActions.createAccount())

        .call.fn(ethManager.unsafeDeleteLostWallet)

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthLostWallet(storeState)).toBeUndefined();
    });

    it("should handle an error during account creation flow", async () => {
      const { expectSaga, ethManager } = setupContextForTests();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [
            matchers.call.fn(ethManager.plugNewRandomWallet),
            providers.throwError(new Error("oy vey")),
          ],
        ])
        .dispatch(authActions.createAccount())

        .not.put(authActions.unlockAccountDone(walletMetadata))
        .put(authActions.failedToCreateAccount())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
      expect(selectIsStateChangeInProgress(storeState)).toBeFalsy();
    });
  });

  describe("importNewAccount", () => {
    it("should import new account from private key", async () => {
      const { expectSaga, ethManager, getState } = setupContextForTests();

      const initialState = getState();
      expect(selectAuthState(initialState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(initialState)).toBeUndefined();

      const privateKey = "0x7ccdc091ae2a3cccb338d1aa00f8ec7ff60f30abb9a447a17fe3326ebc0849f1";

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.hasExistingWallet), false],
          [matchers.call.fn(ethManager.plugNewWalletFromPrivateKey), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
        ])
        .dispatch(authActions.importAccount(privateKey, walletMetadata.name))

        .call([ethManager, "plugNewWalletFromPrivateKey"], privateKey, walletMetadata.name)
        .call.fn(authModuleAPI.sagas.createJwt)
        .call(authModuleAPI.sagas.loadOrCreateUser, {
          walletMetadata: authWalletMetadata,
          userType: EUserType.INVESTOR,
        })

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.AUTHORIZED);
      expect(selectAuthWallet(storeState)).toEqual(walletMetadata);
    });

    it("should import new account from mnemonics", async () => {
      const { expectSaga, ethManager, getState } = setupContextForTests();

      const initialState = getState();
      expect(selectAuthState(initialState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(initialState)).toBeUndefined();

      const mnemonics =
        "submit defy item boss situate isolate purse major retire nothing mammal usual boil hope sentence group vivid clutch another indoor slam illegal street dust";

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.hasExistingWallet), false],
          [matchers.call.fn(ethManager.plugNewWalletFromMnemonic), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
        ])
        .dispatch(authActions.importAccount(mnemonics, walletMetadata.name))

        .call([ethManager, "plugNewWalletFromMnemonic"], mnemonics, walletMetadata.name)
        .call.fn(authModuleAPI.sagas.createJwt)
        .call(authModuleAPI.sagas.loadOrCreateUser, {
          walletMetadata: authWalletMetadata,
          userType: EUserType.INVESTOR,
        })

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.AUTHORIZED);
      expect(selectAuthWallet(storeState)).toEqual(walletMetadata);
    });

    it("should throw when importing new account with invalid backup", async () => {
      const { expectSaga, ethManager } = setupContextForTests();

      const mnemonics = "invalid mnemonics";

      const { storeState } = await expectSaga(authSaga)
        .provide([[matchers.call.fn(ethManager.hasExistingWallet), false]])
        .dispatch(authActions.importAccount(mnemonics, walletMetadata.name))

        .not.call.fn(ethManager.plugNewWalletFromPrivateKey)
        .not.call.fn(ethManager.plugNewWalletFromMnemonic)

        .put(authActions.failedToImportAccount())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
    });

    it("should remove existing account if any", async () => {
      const { expectSaga, ethManager, getState } = setupContextForTests();

      const initialState = getState();
      expect(selectAuthState(initialState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(initialState)).toBeUndefined();

      const privateKey = "0x7ccdc091ae2a3cccb338d1aa00f8ec7ff60f30abb9a447a17fe3326ebc0849f1";

      await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.hasExistingWallet), true],
          [matchers.call.fn(ethManager.unsafeDeleteWallet), undefined],
          [matchers.call.fn(ethManager.plugNewWalletFromPrivateKey), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
        ])
        .dispatch(authActions.importAccount(privateKey, walletMetadata.name))

        .call.fn(ethManager.unsafeDeleteWallet)

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();
    });

    it("should remove lost wallet if there is one", async () => {
      const { expectSaga, ethManager } = setupContextForTests();

      const privateKey = "0x7ccdc091ae2a3cccb338d1aa00f8ec7ff60f30abb9a447a17fe3326ebc0849f1";

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.hasExistingWallet), true],
          [matchers.call.fn(ethManager.unsafeDeleteWallet), undefined],
          [matchers.call.fn(ethManager.plugNewWalletFromPrivateKey), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
        ])
        .dispatch(authActions.accountLost(walletMetadata))
        .dispatch(authActions.importAccount(privateKey, walletMetadata.name))

        .call.fn(ethManager.unsafeDeleteLostWallet)

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthLostWallet(storeState)).toBeUndefined();
    });

    it("should handle an error during account import flow", async () => {
      const { expectSaga, ethManager } = setupContextForTests();

      const privateKey = "0x7ccdc091ae2a3cccb338d1aa00f8ec7ff60f30abb9a447a17fe3326ebc0849f1";

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.hasExistingWallet), false],

          [
            matchers.call.fn(ethManager.plugNewWalletFromPrivateKey),
            providers.throwError(new Error("oy vey")),
          ],
        ])
        .dispatch(authActions.importAccount(privateKey, walletMetadata.name))

        .not.put(authActions.unlockAccountDone(walletMetadata))
        .put(authActions.failedToImportAccount())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
      expect(selectIsStateChangeInProgress(storeState)).toBeFalsy();
    });
  });

  describe("unlockAccount", () => {
    const token = {
      parsed: {
        iat: 1560459566.477146,
        exp: 1560545966,
      },
      jwt:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9.eyJzdWIiOiIweDc0MTgwQjU2REQ3NEJDNTZhMkU5RDU3MjBGMzkyNDdjNTVGMjMzMjgiLCJ1aWQiOiIweDc0MTgwQjU2REQ3NEJDNTZhMkU5RDU3MjBGMzkyNDdjNTVGMjMzMjgiLCJ1aWRfdHlwZSI6IndhbGxldF9hZGRyZXNzIiwiZXhwIjoxNTYwNTQ1OTY2LCJpc3MiOiJuZXVmdW5kIiwiYXVkIjoiZXh0ZXJuYWwiLCJpYXQiOjE1NjA0NTk1NjYuNDc3MTQ2LCJqdGkiOiI2ZmJmMjU1Mi1jZjlmLTRmZTAtODBiNC0xNGMzZGYwYzk2MDAiLCJwZXJtaXNzaW9ucyI6eyJkby1ib29rYnVpbGRpbmciOjE1NjA0NjAxNjYsInNpZ24tdG9zIjoxNTYwNDYwMTQ0fX0.AR2h-_-Iu__YuVb7i0wUNfXB61nd3HpB48hsC_7my1D-IHQCfWzfWYOY0KuI5eMyvZ2DThHquj_-1YciZ2gdvC69AJE5vqH2Yzlc4Hq-LHqjw9Fh1kWh_QVHTBX5_TtAQFwEzyocvrbAtJ83UnqRSRbgyQsi1zPwf_b6qY_ECsbByBk1",
    };

    const { jwt, parsed } = token;

    const clock = setupFakeClock(secondsToMs(parsed.iat), { shouldAdvanceTime: true });

    it("should unlock existing account without jwt", async () => {
      const { expectSaga, ethManager, getState } = setupContextForTests();

      const initialState = getState();
      expect(selectAuthState(initialState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(initialState)).toBeUndefined();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
          [matchers.call.fn(authModuleAPI.sagas.loadJwt), undefined],

          [matchers.call.fn(ethManager.plugExistingWallet), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
        ])
        .dispatch(authActions.unlockAccount())

        .call.fn(ethManager.plugExistingWallet)
        .call.fn(authModuleAPI.sagas.createJwt)
        .call(authModuleAPI.sagas.loadOrCreateUser, {
          walletMetadata: authWalletMetadata,
          userType: EUserType.INVESTOR,
        })

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.AUTHORIZED);
      expect(selectAuthWallet(storeState)).toEqual(walletMetadata);
    });

    it("should unlock existing account with expired jwt", async () => {
      const { expectSaga, ethManager, getState } = setupContextForTests();

      const initialState = getState();
      expect(selectAuthState(initialState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(initialState)).toBeUndefined();

      clock.fakeClock.tick(unixTimestampToTimestamp(parsed.exp - parsed.iat));

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
          [matchers.call.fn(authModuleAPI.sagas.loadJwt), jwt],

          [matchers.call.fn(ethManager.plugExistingWallet), undefined],
          [matchers.call.fn(authModuleAPI.sagas.createJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
        ])
        .dispatch(authActions.unlockAccount())

        .call.fn(ethManager.plugExistingWallet)
        .call.fn(authModuleAPI.sagas.createJwt)
        .call(authModuleAPI.sagas.loadOrCreateUser, {
          walletMetadata: authWalletMetadata,
          userType: EUserType.INVESTOR,
        })

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.AUTHORIZED);
      expect(selectAuthWallet(storeState)).toEqual(walletMetadata);
    });

    it("should unlock existing account with existing jwt", async () => {
      const { expectSaga, ethManager, getState } = setupContextForTests();

      const initialState = getState();
      expect(selectAuthState(initialState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(initialState)).toBeUndefined();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(ethManager.getExistingWalletMetadata), walletMetadata],
          [matchers.call.fn(authModuleAPI.sagas.loadJwt), jwt],

          [matchers.call.fn(ethManager.plugExistingWallet), undefined],
          [matchers.call.fn(authModuleAPI.sagas.setJwt), undefined],
          [matchers.call.fn(authModuleAPI.sagas.loadOrCreateUser), undefined],
        ])
        .dispatch(authActions.unlockAccount())

        .call.fn(ethManager.plugExistingWallet)
        .call(authModuleAPI.sagas.setJwt, {}, jwt)
        .call(authModuleAPI.sagas.loadOrCreateUser, {
          walletMetadata: authWalletMetadata,
          userType: EUserType.INVESTOR,
        })

        .put(authActions.unlockAccountDone(walletMetadata))
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.AUTHORIZED);
      expect(selectAuthWallet(storeState)).toEqual(walletMetadata);
    });

    it("should handle an error during unlock flow", async () => {
      const { expectSaga, ethManager } = setupContextForTests();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [
            matchers.call.fn(ethManager.getExistingWalletMetadata),
            providers.throwError(new Error("oy vey")),
          ],
        ])
        .dispatch(authActions.unlockAccount())

        .not.put(authActions.unlockAccountDone(walletMetadata))
        .put(authActions.failedToUnlockAccount())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
    });
  });

  describe("lockAccount", () => {
    it("should lock account", async () => {
      const { expectSaga } = setupContextForTests();

      const { storeState } = await expectSaga(authSaga)
        .provide([[matchers.call.fn(authModuleAPI.sagas.resetUser), undefined]])
        .dispatch(authActions.lockAccount())

        .call(authModuleAPI.sagas.resetUser, { clearStorage: false })
        .put(authActions.lockAccountDone())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
    });

    it("should handle an error during unlock flow", async () => {
      const { expectSaga } = setupContextForTests();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [
            matchers.call.fn(authModuleAPI.sagas.resetUser),
            providers.throwError(new Error("oy vey")),
          ],
        ])
        .dispatch(authActions.lockAccount())

        .not.put.actionType(authActions.lockAccountDone.getType())
        .put(authActions.failedToLockAccount())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
    });
  });

  describe("logoutAccount", () => {
    it("should logout account", async () => {
      const { expectSaga, ethManager } = setupContextForTests();

      const { storeState } = await expectSaga(authSaga)
        .provide([
          [matchers.call.fn(authModuleAPI.sagas.resetUser), undefined],
          [matchers.call.fn(ethManager.unsafeDeleteWallet), undefined],
        ])
        .dispatch(authActions.logoutAccount())

        .call(authModuleAPI.sagas.resetUser)
        .call.fn(ethManager.unsafeDeleteWallet)
        .put(authActions.logoutAccountDone())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
    });

    it("should handle an error during logout flow", async () => {
      const { expectSaga, ethManager } = setupContextForTests();
      const { storeState } = await expectSaga(authSaga)
        .provide([
          [
            matchers.call.fn(authModuleAPI.sagas.resetUser),
            providers.throwError(new Error("oy vey")),
          ],
          [matchers.call.fn(ethManager.unsafeDeleteLostWallet), undefined],
        ])
        .dispatch(authActions.logoutAccount())

        .call.fn(ethManager.unsafeDeleteLostWallet)
        .put(authActions.logoutAccountDone())
        .run();

      expect(selectAuthState(storeState)).toEqual(EAuthState.NOT_AUTHORIZED);
      expect(selectAuthWallet(storeState)).toBeUndefined();
    });
  });
});
