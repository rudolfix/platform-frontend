import { expect } from "chai";
import { LedgerWallet } from "../../../app/modules/web3/LedgerWallet";
import { WalletNotConnectedError, Web3Manager } from "../../../app/modules/web3/Web3Manager";
import { dummyConfig, dummyNetworkId } from "../../fixtures";
import { createMock, expectToBeRejected } from "../../testUtils";

describe("Web3Manager", () => {
  it("should plug personal wallet when connection works", async () => {
    const expectedNetworkId = dummyNetworkId;

    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => true,
    });

    const web3Manager = new Web3Manager(dummyConfig.ethereumNetwork);
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(web3Manager.personalWallet).to.be.eq(ledgerWalletMock);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
  });

  it("should throw when plugging not connected wallet", async () => {
    const expectedNetworkId = dummyNetworkId;

    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => false,
    });

    const web3Manager = new Web3Manager(dummyConfig.ethereumNetwork);
    web3Manager.networkId = expectedNetworkId;

    await expectToBeRejected(
      () => web3Manager.plugPersonalWallet(ledgerWalletMock),
      new WalletNotConnectedError(ledgerWalletMock),
    );

    expect(web3Manager.personalWallet).to.be.eq(undefined);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
  });
});
