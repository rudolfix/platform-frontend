import { expect } from "chai";
import { spy } from "sinon";
import { NotificationCenter } from "../../../app/modules/notifications/NotificationCenter";
import { personalWalletDisconnectedPlainAction } from "../../../app/modules/web3/actions";
import { web3Flows } from "../../../app/modules/web3/flows";
import { createMock } from "../../testUtils";

describe("web3 > actions", () => {
  describe("personalWalletDisconnectedAction action", () => {
    it("should work", () => {
      const dispatchMock = spy();
      const notificationCenterMock = createMock(NotificationCenter, {
        error: () => {},
      });

      web3Flows.personalWalletDisconnected(dispatchMock, notificationCenterMock);

      expect(dispatchMock).to.be.calledWith(personalWalletDisconnectedPlainAction());
      expect(notificationCenterMock.error).to.be.calledOnce;
    });
  });
});
