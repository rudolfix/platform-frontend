import { expect } from "chai";
import { spy } from "sinon";
import { flows } from "../../../app/modules/flows";
import { obtainJwt } from "../../../app/modules/networking/jwt-actions";

describe("Wallet selector > actions", () => {
  describe("walletConnectedAction", () => {
    it("should redirect", async () => {
      const navigateToMock = spy();
      const dispatchMock = spy();

      await flows.wallet.walletConnected(navigateToMock, dispatchMock);

      expect(navigateToMock).to.be.calledWithExactly("/");
      expect(dispatchMock).to.be.calledWithExactly(obtainJwt);
    });
  });
});
