import { expect } from "chai";
import { spy } from "sinon";
import { createMock } from "../../../test/testUtils";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { actions } from "../actions";
import { web3Flows } from "./flows";

describe("web3 > actions", () => {
  describe("personalWalletDisconnectedAction action", () => {
    it("should work", () => {
      const dispatchMock = spy();
      const notificationCenterMock = createMock(NotificationCenter, {
        error: () => {},
      });

      web3Flows.personalWalletDisconnected(dispatchMock, notificationCenterMock);

      expect(dispatchMock).to.be.calledWith(actions.web3.personalWalletDisconnected());
      expect(notificationCenterMock.error).to.be.calledOnce;
    });
  });
});
