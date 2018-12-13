import { expect } from "chai";
import { delay } from "redux-saga";
import { call, put, select } from "redux-saga/effects";
import { spy } from "sinon";

import { expectSaga } from "redux-saga-test-plan";
import { createMock } from "../../../test/testUtils";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { noopLogger } from "../../lib/dependencies/Logger";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { dummyIntl } from "../../utils/injectIntlHelpers.fixtures";
import { actions } from "../actions";
import {
  getDummyBrowserWalletMetadata,
  getDummyLedgerWalletMetadata,
  getDummyLightWalletMetadata,
} from "./fixtures";
import { autoLockLightWallet, personalWalletConnectionLost } from "./sagas";

describe.only("Web3 sagas", () => {
  describe("light wallet password", () => {
    it("should reset password after timeout", async () => {
      const personalWalletMock = {
        password: "some dummy pass",
      } as any;
      const web3ManagerMock = createMock(Web3Manager, {
        personalWallet: personalWalletMock,
      });

      await expectSaga(autoLockLightWallet as any, {
        web3Manager: web3ManagerMock,
        logger: noopLogger,
      })
        .put(actions.web3.walletLocked())
        .put(actions.web3.clearSeedFromState())
        .call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME)
        .provide([[call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME), undefined]])
        .run();

      expect(personalWalletMock.password).to.be.undefined;
    });
  });

  describe("personal walled connection lost", () => {
    it("should send notification if it's ledger wallet", async () => {
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLedgerWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      await expectSaga(personalWalletConnectionLost, {
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      })
        .withState(state)
        .put(actions.walletSelector.reset())
        .put(actions.walletSelector.ledgerReset())
        .put(actions.web3.personalWalletDisconnected())
        .run();

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should send notification if it's browser wallet", async () => {
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyBrowserWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      await expectSaga(personalWalletConnectionLost, {
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      })
        .withState(state)
        .run();

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should not send notification if it's light wallet", async () => {
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLightWalletMetadata(),
        },
      };
      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      await expectSaga(personalWalletConnectionLost, {
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      })
        .withState(state)
        .run();

      expect(dummyNotificationCenter.error).not.to.be.called;
    });
  });
});
