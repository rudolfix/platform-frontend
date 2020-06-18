import { EWalletType } from "@neufund/shared-modules";
import { expect } from "chai";

import { TestMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TAppGlobalState } from "../../store";
import { selectAccessWallet, selectIsAccessWalletModalOpen } from "./selectors";

describe("access-wallet selectors", () => {
  describe("selectAccessWallet", () => {
    it("selects the whole accessWallet state object", () => {
      const accessWalletState = {
        isModalOpen: false,
        errorMessage: undefined,
        modalTitle: createMessage(TestMessage.TEST_MESSAGE),
        modalMessage: createMessage(TestMessage.TEST_MESSAGE),
        inputLabel: createMessage(TestMessage.TEST_MESSAGE),
      };
      const partialState = {
        web3: {
          connected: true,
          wallet: {
            walletType: EWalletType.LIGHT,
          },
        },
        accessWallet: accessWalletState,
      } as TAppGlobalState;

      expect(selectAccessWallet(partialState)).to.deep.eq(accessWalletState);
    });
  });

  describe("selectIsAccessWalletModalOpen", () => {
    it("selects isModalOpen", () => {
      const partialState1 = {
        accessWallet: {
          isModalOpen: false,
        },
      } as TAppGlobalState;

      const partialState2 = {
        accessWallet: {
          isModalOpen: true,
        },
      } as TAppGlobalState;

      expect(selectIsAccessWalletModalOpen(partialState1)).to.be.false;
      expect(selectIsAccessWalletModalOpen(partialState2)).to.be.true;
    });
  });
});
