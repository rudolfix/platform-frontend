import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import { spy } from "sinon";
import {
  finishSettingUpLedgerConnectorAction,
  goToNextPageAndLoadDataAction,
  goToPreviousPageAndLoadDataAction,
  ledgerWizardAccountsListNextPageAction,
  ledgerWizardAccountsListPreviousPageAction,
  loadLedgerAccountsAction,
  setLedgerAccountsAction,
} from "../../../../app/modules/wallet-selector/ledger-wizard/actions";
import { IDerivationPathToAddress, LedgerWallet } from "../../../../app/modules/web3/LedgerWallet";
import { Web3Adapter } from "../../../../app/modules/web3/Web3Adapter";
import { WalletNotConnectedError, Web3Manager } from "../../../../app/modules/web3/Web3Manager";
import { IAppState } from "../../../../app/store";
import { createMock } from "../../../testUtils";

describe("Wallet selector > Ledger wizard > actions", () => {
  describe("loadLedgerAccountsAction", () => {
    it("should load accounts from ledger connector", async () => {
      const dummyState: Partial<IAppState> = {
        ledgerWizardState: {
          index: 1,
          numberOfAccountsPerPage: 10,
          derivationPathPrefix: "44'/60'/0'/",
          accounts: [],
          isLoading: false,
        },
      };
      const expectedAccounts: IDerivationPathToAddress = {
        "44'/60'/0'/1": "0x131213123123",
        "44'/60'/0'/2": "0xab2245c",
      };
      const expectedAccountsToBalances: Dictionary<number> = {
        "0x131213123123": 4,
        "0xab2245c": 15,
      };

      const dispatchMock = spy();
      const getStateMock = spy(() => dummyState);
      const ledgerConnectorMock = createMock(LedgerWallet, {
        getMultipleAccounts: spy(() => expectedAccounts),
      });
      const web3ManagerMock = createMock(Web3Manager, {
        internalWeb3Adapter: createMock(Web3Adapter, {
          getBalance: (address: string) =>
            Promise.resolve(new BigNumber(expectedAccountsToBalances[address])),
        }),
      });

      await loadLedgerAccountsAction(
        dispatchMock,
        getStateMock,
        ledgerConnectorMock,
        web3ManagerMock,
      );

      expect(ledgerConnectorMock.getMultipleAccounts).to.calledWithExactly(
        dummyState.ledgerWizardState!.derivationPathPrefix,
        dummyState.ledgerWizardState!.index,
        dummyState.ledgerWizardState!.numberOfAccountsPerPage,
      );
      expect(dispatchMock).to.be.calledWithExactly(
        setLedgerAccountsAction({
          accounts: [
            {
              address: expectedAccounts["44'/60'/0'/1"],
              balance: expectedAccountsToBalances[expectedAccounts["44'/60'/0'/1"]].toString(),
              derivationPath: "44'/60'/0'/1",
            },
            {
              address: expectedAccounts["44'/60'/0'/2"],
              balance: expectedAccountsToBalances[expectedAccounts["44'/60'/0'/2"]].toString(),
              derivationPath: "44'/60'/0'/2",
            },
          ],
        }),
      );
    });
  });

  describe("goToNextPageAndLoadDataAction", () => {
    it("should work", async () => {
      const mockDispatch = spy();

      goToNextPageAndLoadDataAction(mockDispatch);

      expect(mockDispatch).to.be.calledTwice;
      expect(mockDispatch).to.be.calledWith(ledgerWizardAccountsListNextPageAction());
      expect(mockDispatch).to.be.calledWith(loadLedgerAccountsAction);
    });
  });

  describe("goToPreviousPageAndLoadDataAction", async () => {
    it("should work", () => {
      const mockDispatch = spy();

      goToPreviousPageAndLoadDataAction(mockDispatch);

      expect(mockDispatch).to.be.calledTwice;
      expect(mockDispatch).to.be.calledWith(ledgerWizardAccountsListPreviousPageAction());
      expect(mockDispatch).to.be.calledWith(loadLedgerAccountsAction);
    });
  });

  describe("finishSettingUpLedgerConnectorAction", () => {
    it("should work when ledger wallet is connected", async () => {
      const expectedDerivationPath = "44'/60'/0'/2";

      const navigateToMock = spy();
      const ledgerWalletMock = createMock(LedgerWallet, {
        setDerivationPath: () => {},
      });
      const web3ManagerMock = createMock(Web3Manager, {
        plugPersonalWallet: async () => {},
      });

      await finishSettingUpLedgerConnectorAction(expectedDerivationPath)(
        navigateToMock,
        ledgerWalletMock,
        web3ManagerMock,
      );

      expect(ledgerWalletMock.setDerivationPath).to.be.calledWithExactly(expectedDerivationPath);
      expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
      expect(navigateToMock).to.be.calledWithExactly("/platform");
    });

    it("should not navigate when ledger wallet is not connected", async () => {
      // @todo exact behaviour should be specified
      const expectedDerivationPath = "44'/60'/0'/2";

      const navigateToMock = spy();
      const ledgerWalletMock = createMock(LedgerWallet, {
        setDerivationPath: () => {},
      });
      const web3ManagerMock = createMock(Web3Manager, {
        plugPersonalWallet: async () => {
          throw new WalletNotConnectedError(ledgerWalletMock);
        },
      });

      await finishSettingUpLedgerConnectorAction(expectedDerivationPath)(
        navigateToMock,
        ledgerWalletMock,
        web3ManagerMock,
      ).catch(() => {});

      expect(ledgerWalletMock.setDerivationPath).to.be.calledWithExactly(expectedDerivationPath);
      expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
      expect(navigateToMock).not.be.called;
    });
  });
});
