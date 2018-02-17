import { expect } from "chai";
import { spy } from "sinon";
import { obtainJwt } from "../../../app/modules/networking/jwt-actions";
import { walletFlows } from "../../../app/modules/wallet-selector/flows";

describe("Wallet selector > actions", () => {
  describe("walletConnectedAction", () => {
    it("should redirect", async () => {
      const navigateToMock = spy();
      const dispatchMock = spy();

      await walletFlows.walletConnected(navigateToMock, dispatchMock);

      expect(navigateToMock).to.be.calledWithExactly("/");
      expect(dispatchMock).to.be.calledWithExactly(obtainJwt);
    });
  });
});
