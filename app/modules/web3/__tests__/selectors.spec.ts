import { expect } from "chai";
import { dummyEthereumAddress } from "../../../../test/fixtures";
import { IWeb3State } from "../reducer";
import { selectIsLightWallet } from "../selectors";
import { WalletType } from "../types";
import { getDummyLightWalletMetadata } from "./fixtures";

describe("web3 > selectors", () => {
  describe("selectIsLightWallet", () => {
    it("should work with connected wallet", () => {
      const state: IWeb3State = {
        connected: true,
        isUnlocked: false,
        wallet: getDummyLightWalletMetadata(),
      };

      const isLightWallet = selectIsLightWallet(state);

      expect(isLightWallet).to.be.true;
    });

    it("should work with not connected wallet", () => {
      const state: IWeb3State = {
        connected: false,
        previousConnectedWallet: {
          walletType: WalletType.LIGHT,
          address: dummyEthereumAddress,
          vault: "vault",
          email: "test@example.com",
          salt: "salt",
        },
      };

      const isLightWallet = selectIsLightWallet(state);

      expect(isLightWallet).to.be.true;
    });
  });
});
