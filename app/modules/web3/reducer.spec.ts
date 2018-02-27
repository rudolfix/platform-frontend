import { expect } from "chai";
import { dummyEthereumAddress } from "../../../test/fixtures";
import { actions } from "../actions";
import { web3Actions } from "./actions";
import { IWeb3State, web3InitialState, web3Reducer } from "./reducer";
import { WalletSubType, WalletType } from "./types";

describe("Web3 > reducer", () => {
  it("should act on NEW_PERSONAL_WALLET_PLUGGED action", () => {
    const initialState = web3InitialState;
    const actionPayload = {
      type: WalletType.BROWSER,
      subtype: WalletSubType.METAMASK,
      ethereumAddress: dummyEthereumAddress,
      isUnlocked: true,
    };

    const actualNewState = web3Reducer(
      initialState,
      web3Actions.newPersonalWalletPlugged(
        actionPayload.type,
        actionPayload.subtype,
        actionPayload.ethereumAddress,
        actionPayload.isUnlocked,
      ),
    );

    expect(actualNewState).to.be.deep.eq({
      connected: true,
      type: actionPayload.type,
      subtype: actionPayload.subtype,
      ethereumAddress: dummyEthereumAddress,
      isUnlocked: true,
    });
  });

  it("should act on PERSONAL_WALLET_DISCONNECTED when previously it was connected", () => {
    const initialState: IWeb3State = {
      connected: true,
      type: WalletType.BROWSER,
      subtype: WalletSubType.METAMASK,
      ethereumAddress: dummyEthereumAddress,
      isUnlocked: true,
    };

    const actualNewState = web3Reducer(initialState, actions.web3.personalWalletDisconnected());

    expect(actualNewState).to.be.deep.eq({
      connected: false,
      previousConnectedWalletType: WalletType.BROWSER,
    });
  });

  it("should act on PERSONAL_WALLET_DISCONNECTED action", () => {
    const initialState = web3InitialState;

    const actualNewState = web3Reducer(initialState, actions.web3.personalWalletDisconnected());

    expect(actualNewState).to.be.deep.eq({
      connected: false,
      previousConnectedWalletType: undefined,
    });
  });
});
