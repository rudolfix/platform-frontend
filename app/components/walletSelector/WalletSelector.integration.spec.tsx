import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import { createMount } from "../../../test/createMount";
import { dummyEthereumAddress, dummyNetworkId } from "../../../test/fixtures";
import {
  createIntegrationTestsSetup,
  waitForPredicate,
  waitForTid,
  wrapWithProviders,
} from "../../../test/integrationTestUtils";
import { globalFakeClock } from "../../../test/setupTestsHooks";
import { createMock, tid } from "../../../test/testUtils";
import { symbols } from "../../di/symbols";
import { SignatureAuthApi } from "../../lib/api/SignatureAuthApi";
import { UsersApi } from "../../lib/api/UsersApi";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
  BrowserWalletMissingError,
} from "../../lib/web3/BrowserWallet";
import { LedgerWallet, LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { SignerType } from "../../lib/web3/PersonalWeb3";
import { Web3Adapter } from "../../lib/web3/Web3Adapter";
import { Web3ManagerMock } from "../../lib/web3/Web3Manager.mock";
import { actions } from "../../modules/actions";
import { WalletSubType, WalletType } from "../../modules/web3/types";
import { BROWSER_WALLET_RECONNECT_INTERVAL } from "./WalletBrowser";
import { LEDGER_RECONNECT_INTERVAL } from "./WalletLedgerInitComponent";
import { walletRoutes } from "./walletRoutes";
import { WalletSelector } from "./WalletSelector";

describe("integration", () => {
  it("should select ledger wallet", async () => {
    const expectedAddress = dummyEthereumAddress;
    const expectedChallenge = "CHALLENGE";
    const ledgerWalletMock = createMock(LedgerWallet, {
      walletType: WalletType.LEDGER,
      walletSubType: WalletSubType.UNKNOWN,
      signerType: SignerType.ETH_SIGN,
      ethereumAddress: expectedAddress,
      testConnection: async () => false,
    });
    const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {});
    const internalWeb3AdapterMock = createMock(Web3Adapter, {
      getBalance: async () => new BigNumber(1),
    });
    const signatureAuthApiMock = createMock(SignatureAuthApi, {
      challenge: async () => ({
        statusCode: 200,
        body: {
          challenge: expectedChallenge,
        },
      }),
      createJwt: async () => ({
        statusCode: 200,
        body: {
          jwt: "JWT",
        },
      }),
    });
    const usersApiMock = createMock(UsersApi, {
      me: async () => ({}), // no user
      createAccount: async () => ({}),
    });

    const { store, container, dispatchSpy } = createIntegrationTestsSetup({
      ledgerWalletConnectorMock,
      signatureAuthApiMock,
      usersApiMock,
      initialState: {
        browser: {
          name: "chrome",
          version: "58.0.0",
        },
      },
    });
    container
      .get<Web3ManagerMock>(symbols.web3Manager)
      .initializeMock(internalWeb3AdapterMock, dummyNetworkId);

    const mountedComponent = createMount(
      wrapWithProviders(WalletSelector, {
        container,
        store,
        currentRoute: walletRoutes.light,
      }),
    );

    // ensure that ledger tab is selected
    mountedComponent
      .find(tid("wallet-selector-ledger"))
      .find("a")
      .simulate("click", { button: 0 });

    expect(mountedComponent.find(tid("ledger-wallet-error-msg")).text()).to.be.eq(
      "Nano Ledger S not available",
    );

    // simulate successful connection
    ledgerWalletConnectorMock.reMock({
      connect: async () => {},
      testConnection: async () => true,
      getMultipleAccounts: async () => ({
        "44'/60'/0'/1": "0x12345123123",
      }),
      finishConnecting: async () => {
        return ledgerWalletMock;
      },
    });
    ledgerWalletMock.reMock({
      testConnection: async () => true,
      signMessage: async mess => dummySign(mess),
    });
    globalFakeClock.tick(LEDGER_RECONNECT_INTERVAL);

    await waitForTid(mountedComponent, "wallet-ledger-accounts-table-body");

    // select one of the addresses
    mountedComponent
      .find(`${tid("button-select")}`)
      .first()
      .simulate("click");

    await waitForPredicate(
      () => dispatchSpy.calledWith(actions.routing.goToDashboard()),
      "Navigation to dashboard action",
    );

    expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledOnce;
    expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledWithExactly("44'/60'/0'/1");
    expect(dispatchSpy).calledWithExactly(
      actions.web3.newPersonalWalletPlugged(
        WalletType.LEDGER,
        WalletSubType.UNKNOWN,
        expectedAddress,
      ),
    );
    expect(ledgerWalletMock.signMessage).to.be.calledOnce;
    expect(ledgerWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
    expect(signatureAuthApiMock.createJwt).to.be.calledOnce;
    expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
      expectedChallenge,
      dummySign(expectedChallenge),
      SignerType.ETH_SIGN,
    );
  });

  it("should select browser wallet", async () => {
    const expectedAddress = dummyEthereumAddress;
    const expectedChallenge = "CHALLENGE";
    const browserWalletMock = createMock(BrowserWallet, {
      walletType: WalletType.BROWSER,
      walletSubType: WalletSubType.METAMASK,
      ethereumAddress: expectedAddress,
      signerType: SignerType.ETH_SIGN_TYPED_DATA,
    });
    const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
      connect: async () => {
        throw new BrowserWalletMissingError();
      },
    });
    const internalWeb3AdapterMock = createMock(Web3Adapter, {
      getBalance: async () => new BigNumber(1),
    });
    const signatureAuthApiMock = createMock(SignatureAuthApi, {
      challenge: async () => ({
        statusCode: 200,
        body: {
          challenge: expectedChallenge,
        },
      }),
      createJwt: async () => ({
        statusCode: 200,
        body: {
          jwt: "JWT",
        },
      }),
    });
    const usersApiMock = createMock(UsersApi, {
      me: async () => ({}), // no user
      createAccount: async () => ({}),
    });

    const { store, container, dispatchSpy } = createIntegrationTestsSetup({
      browserWalletConnectorMock,
      signatureAuthApiMock,
      usersApiMock,
    });
    container
      .get<Web3ManagerMock>(symbols.web3Manager)
      .initializeMock(internalWeb3AdapterMock, dummyNetworkId);

    const mountedComponent = createMount(
      wrapWithProviders(WalletSelector, {
        container,
        store,
      }),
    );

    // select wallet in browser tab is selected
    mountedComponent
      .find(tid("wallet-selector-browser"))
      .find("a")
      .simulate("click", { button: 0 });
    await waitForTid(mountedComponent, "browser-wallet-error-msg");

    // there is no wallet in browser (BrowserWallet thrown BrowserWalletMissingError)
    expect(mountedComponent.find(tid("browser-wallet-error-msg")).text()).to.be.eq(
      "We did not detect any Web3 wallet.",
    );

    // wallet in browser is locked
    browserWalletConnectorMock.reMock({
      connect: async () => {
        throw new BrowserWalletLockedError();
      },
    });
    await globalFakeClock.tickAsync(BROWSER_WALLET_RECONNECT_INTERVAL);
    mountedComponent.update();

    expect(mountedComponent.find(tid("browser-wallet-error-msg")).text()).to.be.eq(
      "Your wallet seems to be locked — we can't access any accounts.",
    );

    // connect doesn't throw which means there is web3 in browser
    browserWalletMock.reMock({
      testConnection: async () => true,
      signMessage: async mess => dummySign(mess),
    });
    browserWalletConnectorMock.reMock({
      connect: async () => browserWalletMock,
    });
    await globalFakeClock.tickAsync(BROWSER_WALLET_RECONNECT_INTERVAL);

    await waitForPredicate(
      () => dispatchSpy.calledWith(actions.routing.goToDashboard()),
      "Navigation to dashboard action",
    );

    expect(dispatchSpy).calledWithExactly(
      actions.web3.newPersonalWalletPlugged(
        WalletType.BROWSER,
        WalletSubType.METAMASK,
        expectedAddress,
      ),
    );
    expect(browserWalletMock.signMessage).to.be.calledOnce;
    expect(browserWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
    expect(signatureAuthApiMock.createJwt).to.be.calledOnce;
    expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
      expectedChallenge,
      dummySign(expectedChallenge),
      SignerType.ETH_SIGN_TYPED_DATA,
    );
  });
});

function dummySign(mess: string): string {
  return `SIGNED: ${mess}`;
}
