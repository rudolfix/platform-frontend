import { expect } from "chai";
import { spy } from "sinon";
import { obtainJwt } from "../../../app/modules/networking/jwt-actions";
import { walletConnectedAction } from "../../../app/modules/wallet-selector/actions";

describe("Wallet selector > actions", () => {
  describe("walletConnectedAction", () => {
    it("should redirect", async () => {
      const navigateToMock = spy();
      const dispatchMock = spy();

      await walletConnectedAction(navigateToMock, dispatchMock);

      expect(navigateToMock).to.be.calledWithExactly("/");
      expect(dispatchMock).to.be.calledWithExactly(obtainJwt);
    });
  });
});
