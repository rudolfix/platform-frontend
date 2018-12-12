import { expect } from "chai";
import { delay } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { spy } from "sinon";

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

describe("Web3 sagas", () => {
  describe("light wallet password", () => {
    it("should reset password after timeout", () => {
      const personalWalletMock = {
        password: "some dummy pass",
      } as any;
      const web3ManagerMock = createMock(Web3Manager, {
        personalWallet: personalWalletMock,
      });
      const saga = autoLockLightWallet(({
        web3Manager: web3ManagerMock,
        logger: noopLogger,
      } as any) as TGlobalDependencies);

      expect(saga.next().value).to.be.deep.eq(call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME));
      expect(saga.next().value).to.be.deep.eq(put(actions.web3.walletLocked()));
      expect(saga.next().value).to.be.deep.eq(put(actions.web3.clearSeedFromState()));
      expect(saga.next().value).to.be.undefined;
      expect(personalWalletMock.password).to.be.undefined;
    });
  });

  describe("personal walled connection lost", () => {
    it("calls several other actions", () => {
      const saga: IterableIterator<any> = personalWalletConnectionLost({} as any);

      expect(saga.next().value).to.deep.eq(put(actions.walletSelector.reset()));
      expect(saga.next().value).to.deep.eq(put(actions.walletSelector.ledgerReset()));
      expect(saga.next().value).to.deep.eq(put(actions.web3.personalWalletDisconnected()));
    });

    it("should send notification if it's ledger wallet", () => {
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLedgerWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      const saga = personalWalletConnectionLost({
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      } as any);

      saga.next();
      saga.next();
      saga.next();
      saga.next();
      saga.next(state);

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should send notification if it's browser wallet", () => {
      const dummyDispatch = spy();
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyBrowserWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      const saga = personalWalletConnectionLost({
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      } as any);

      saga.next();
      saga.next();
      saga.next();
      saga.next();
      saga.next(state);

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should not send notification if it's light wallet", () => {
      const dummyDispatch = spy();
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLightWalletMetadata(),
        },
      };
      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      const saga: IterableIterator<any> = personalWalletConnectionLost({
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      } as any);

      saga.next();
      saga.next();
      saga.next();
      saga.next();
      expect(saga.next(state).done).to.be.true;

      expect(dummyNotificationCenter.error).not.to.be.calledOnce;
    });
  });
});
