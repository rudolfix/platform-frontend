import { expect } from "chai";
import { spy } from "sinon";
import {
  LightWalletCreatedAction,
} from "../../../../app/modules/wallet-selector/light-wizard/actions";
import { IVault } from "../../../../app/modules/web3/LightWallet";

describe("Wallet selector > Browser wizard > actions", () => {
  describe.only("tryConnectingWithLightWallet action", () => {
    it("should create new wallet and store", async () => {
      const lightWalletVault: any = { walletInstance: "instance", salt: "salt" };

      const dispatchMock = spy();
      const lightWalletMock = ({ walletInstance, salt }: IVault) => {
        return lightWalletVault;
      };

      //   await tryConnectingWithLightWallet(dispatchMock, lightWalletMock);

      expect(dispatchMock).to.be.calledWithExactly(LightWalletCreatedAction({ lightWalletVault }));
    });
  });
});
