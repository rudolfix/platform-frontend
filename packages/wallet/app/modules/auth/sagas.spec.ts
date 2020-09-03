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
import { toEthereumChecksumAddress } from "@neufund/shared-utils";

import { setupBiometricsModule } from "../biometrics/module";
import { EWalletType, setupWalletEthModule, walletEthModuleApi } from "../eth/module";
import { authActions } from "./actions";
import { EAuthState, setupAuthModule } from "./module";
import { authSaga } from "./sagas";
import { ensureNoLostWallet } from "./sagasInternal";
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

  // const analyticsApi = createMock(AnalyticsApi, {
  //   getUpdatedTransactions: callGuard("getUpdatedTransactions"),
  //   getTransactionsList: callGuard("getTransactionsList"),
  // });

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
        .call.fn(ethManager.getExistingWalletMetadata)

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

    it.only("should handle an error during account creation flow", async () => {
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
});
