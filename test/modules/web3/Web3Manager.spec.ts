import { expect } from "chai";
import { spy } from "sinon";
import { newPersonalWalletPluggedAction } from "../../../app/modules/web3/actions";
import { web3Flows } from "../../../app/modules/web3/flows";
import { LedgerWallet } from "../../../app/modules/web3/LedgerWallet";
import { WalletSubType, WalletType } from "../../../app/modules/web3/PersonalWeb3";
import {
  WalletNotConnectedError,
  WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
  Web3Manager,
} from "../../../app/modules/web3/Web3Manager";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactoryType,
} from "../../../app/utils/AsyncIntervalScheduler";
import { delay } from "../../../app/utils/delay";
import { dummyConfig, dummyEthereumAddress, dummyLogger, dummyNetworkId } from "../../fixtures";
import { globalFakeClock } from "../../setupTestsHooks";
import { createMock, expectToBeRejected } from "../../testUtils";

describe("Web3Manager", () => {
  const expectedNetworkId = dummyNetworkId;

  it("should plug personal wallet when connection works", async () => {
    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      ethereumAddress: dummyEthereumAddress,
      testConnection: async () => true,
      walletType: WalletType.LEDGER,
      walletSubType: WalletSubType.UNKNOWN,
    });
    const asyncIntervalSchedulerMock = createMock(AsyncIntervalScheduler, {
      start: () => {},
    });
    const asyncIntervalSchedulerFactoryMock = () => asyncIntervalSchedulerMock;

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      dummyLogger,
      asyncIntervalSchedulerFactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(web3Manager.personalWallet).to.be.eq(ledgerWalletMock);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
    expect(dispatchMock).to.be.calledWithExactly(
      newPersonalWalletPluggedAction({
        type: WalletType.LEDGER,
        subtype: WalletSubType.UNKNOWN,
        ethereumAddress: dummyEthereumAddress,
      }),
    );
    expect(asyncIntervalSchedulerMock.start).to.be.calledOnce;
  });

  it("should throw when plugging not connected wallet", async () => {
    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => false,
    });
    const asyncIntervalSchedulerMock = createMock(AsyncIntervalScheduler, {
      start: () => {},
    });
    const asyncIntervalSchedulerFactoryMock = () => asyncIntervalSchedulerMock;

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      dummyLogger,
      asyncIntervalSchedulerFactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;

    await expectToBeRejected(
      () => web3Manager.plugPersonalWallet(ledgerWalletMock),
      new WalletNotConnectedError(ledgerWalletMock),
    );

    expect(web3Manager.personalWallet).to.be.eq(undefined);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
  });

  it("should watch connection status", async () => {
    const dispatchMock = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => true,
    });
    const asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType = (cb, interval) =>
      new AsyncIntervalScheduler(dummyLogger, cb, interval);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      dummyLogger,
      asyncIntervalSchedulerFactory,
    );
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(ledgerWalletMock.testConnection).to.be.calledOnce;

    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletMock.testConnection).to.be.calledTwice;

    ledgerWalletMock.reMock({
      testConnection: async () => false,
    });
    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletMock.testConnection).to.be.calledOnce; // remocking resets counter
    expect(dispatchMock).to.be.calledWithExactly(web3Flows.personalWalletDisconnected);
  });

  it("should fail on connection timeout", async () => {
    const dispatchMock = spy();
    const ledgerWalletConnectionMock = createMock(LedgerWallet, {
      testConnection: async () => true,
    });
    const asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType = (cb, interval) =>
      new AsyncIntervalScheduler(dummyLogger, cb, interval);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      dispatchMock,
      dummyLogger,
      asyncIntervalSchedulerFactory,
    );
    web3Manager.networkId = expectedNetworkId;

    await web3Manager.plugPersonalWallet(ledgerWalletConnectionMock);

    expect(ledgerWalletConnectionMock.testConnection).to.be.calledOnce;

    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletConnectionMock.testConnection).to.be.calledTwice;

    // make personal wallet timeout
    ledgerWalletConnectionMock.reMock({
      testConnection: async () => {
        await delay(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL * 2);
        return false;
      },
    });
    // run testConnection again
    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    // wait until timeout
    await globalFakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);

    expect(ledgerWalletConnectionMock.testConnection).to.be.calledOnce;
    expect(dispatchMock).to.be.calledTwice;
    expect(dispatchMock).to.be.calledWithExactly(web3Flows.personalWalletDisconnected);
  });
});
