import { expect } from "chai";
import { spy } from "sinon";
import { walletConnectedAction } from "../../../app/modules/wallet-selector/actions";

describe("Wallet selector > actions", () => {
  describe("walletConnectedAction", () => {
    it("should redirect", () => {
      const navigateToMock = spy();

      walletConnectedAction(navigateToMock);

      expect(navigateToMock).to.be.calledWithExactly("/");
    });
  });
});
