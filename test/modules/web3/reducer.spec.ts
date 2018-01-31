import { expect } from "chai";
import {
  newPersonalWalletPluggedAction,
  personalWalletDisconnectedPlainAction,
} from "../../../app/modules/web3/actions";
import { WalletSubType, WalletType } from "../../../app/modules/web3/PersonalWeb3";
import { IWeb3State, web3InitialState, web3Reducer } from "../../../app/modules/web3/reducer";

describe("Web3 > reducer", () => {
  it("should act on NEW_PERSONAL_WALLET_PLUGGED action", () => {
    const initialState = web3InitialState;
    const actionPayload = { type: WalletType.BROWSER, subtype: WalletSubType.METAMASK };

    const actualNewState = web3Reducer(initialState, newPersonalWalletPluggedAction(actionPayload));

    expect(actualNewState).to.be.deep.eq({
      connected: true,
      type: actionPayload.type,
      subtype: actionPayload.subtype,
    });
  });

  it("should act on PERSONAL_WALLET_DISCONNECTED when previously it was connected", () => {
    const initialState: IWeb3State = {
      connected: true,
      type: WalletType.BROWSER,
      subtype: WalletSubType.METAMASK,
    };

    const actualNewState = web3Reducer(initialState, personalWalletDisconnectedPlainAction());

    expect(actualNewState).to.be.deep.eq({
      connected: false,
      previousConnectedWalletType: WalletType.BROWSER,
    });
  });

  it("should act on PERSONAL_WALLET_DISCONNECTED action", () => {
    const initialState = web3InitialState;

    const actualNewState = web3Reducer(initialState, personalWalletDisconnectedPlainAction());

    expect(actualNewState).to.be.deep.eq({
      connected: false,
      previousConnectedWalletType: undefined,
    });
  });
});
