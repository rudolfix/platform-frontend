import { expect } from "chai";
import { delay } from "redux-saga";
import { call, put } from "redux-saga/effects";

import { dummyLogger } from "../../../test/fixtures";
import { createMock } from "../../../test/testUtils";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { actions } from "../actions";
import { clearUnlockedWalletPassword } from "./sagas";

describe("Web3 sagas", () => {
  describe("light wallet password", () => {
    it("should reset password after timeout", () => {
      const personalWalletMock = {
        password: "some dummy pass",
      } as any;
      const web3ManagerMock = createMock(Web3Manager, {
        personalWallet: personalWalletMock,
      });
      const saga = clearUnlockedWalletPassword(web3ManagerMock, dummyLogger);

      expect(saga.next().value).to.be.deep.eq(call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME));
      expect(saga.next().value).to.be.deep.eq(put(actions.web3.walletLocked()));
      expect(saga.next().value).to.be.undefined;
      expect(personalWalletMock.password).to.be.undefined;
    });
  });
});
