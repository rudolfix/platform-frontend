import { expect } from "chai";
import { spy } from "sinon";

import { dummyIntl } from "./../../../utils/injectIntlHelpers.fixtures";
import { dummyEthereumAddress } from "../../../../test/fixtures";
import { createMock } from "../../../../test/testUtils";
import { NotificationCenter } from "../../../lib/dependencies/NotificationCenter";
import { IAppState } from "../../../store";
import { web3Flows } from "../flows";
import { WalletType } from "../types";
import { getDummyLightWalletMetadata } from "./fixtures";

describe("web3 > flows", () => {
  describe("personalWalletDisconnected", () => {
    it("should send notification if it's not light wallet", () => {
      const dummyDispatch = spy();
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: {
            walletType: WalletType.BROWSER,
            address: dummyEthereumAddress,
          },
        },
      };
      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      web3Flows.personalWalletDisconnected(
        dummyDispatch,
        () => state as any,
        dummyNotificationCenter,
        { intl: dummyIntl },
      );

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

      web3Flows.personalWalletDisconnected(
        dummyDispatch,
        () => state as any,
        dummyNotificationCenter,
        { intl: dummyIntl },
      );

      expect(dummyNotificationCenter.error).not.to.be.called;
    });
  });
});
