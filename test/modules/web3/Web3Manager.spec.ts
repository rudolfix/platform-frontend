import { expect } from "chai";
import { spy } from "sinon";
import { newPersonalWalletPluggedAction } from "../../../app/modules/web3/actions";
import { LedgerWallet } from "../../../app/modules/web3/LedgerWallet";
import { WalletSubType, WalletType } from "../../../app/modules/web3/PersonalWeb3";
import { WalletNotConnectedError, Web3Manager } from "../../../app/modules/web3/Web3Manager";
import { dummyConfig, dummyNetworkId } from "../../fixtures";
import { createMock, expectToBeRejected } from "../../testUtils";

describe("Web3Manager", () => {
  it("should plug personal wallet when connection works", async () => {
    const expectedNetworkId = dummyNetworkId;

    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      type: WalletType.LEDGER,
      subType: WalletSubType.UNKNOWN,
      testConnection: async () => true,
    });

    const web3Manager = new Web3Manager(dummyConfig.ethereumNetwork, dispatchMock);
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(web3Manager.personalWallet).to.be.eq(ledgerWalletMock);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
    expect(dispatchMock).to.be.calledWithExactly(
      newPersonalWalletPluggedAction({ type: WalletType.LEDGER, subtype: WalletSubType.UNKNOWN }),
    );
  });

  it("should throw when plugging not connected wallet", async () => {
    const expectedNetworkId = dummyNetworkId;

    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => false,
    });

    const web3Manager = new Web3Manager(dummyConfig.ethereumNetwork, dispatchMock);
    web3Manager.networkId = expectedNetworkId;

    await expectToBeRejected(
      () => web3Manager.plugPersonalWallet(ledgerWalletMock),
      new WalletNotConnectedError(ledgerWalletMock),
    );

    expect(web3Manager.personalWallet).to.be.eq(undefined);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
  });
});
