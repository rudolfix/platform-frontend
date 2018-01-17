import { expect } from "chai";
import {
  ledgerWizardAccountsListNextPageAction,
  ledgerWizardAccountsListPreviousPageAction,
  setLedgerAccountsAction,
} from "../../../../app/modules/wallet-selector/ledger-wizard/actions";
import {
  ILedgerWizardState,
  ledgerWizardReducer,
} from "../../../../app/modules/wallet-selector/ledger-wizard/reducer";

describe("Wallet selector > Ledger wizard > reducer", () => {
  it("should act on LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE action", () => {
    const newState = ledgerWizardReducer(undefined, ledgerWizardAccountsListNextPageAction());

    expect(newState).to.be.deep.eq({
      accounts: [],
      derivationPathPrefix: "44'/60'/0'/",
      index: 1,
      isLoading: true,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should act on LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE action", () => {
    const state: ILedgerWizardState = {
      accounts: [],
      derivationPathPrefix: "44'/60'/0'/",
      index: 1,
      isLoading: true,
      numberOfAccountsPerPage: 10,
    };

    const newState = ledgerWizardReducer(state, ledgerWizardAccountsListPreviousPageAction());

    expect(newState).to.be.deep.eq({
      accounts: [],
      derivationPathPrefix: "44'/60'/0'/",
      index: 0,
      isLoading: true,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should do nothing on LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE action when its first page", () => {
    const state: ILedgerWizardState = {
      accounts: [],
      derivationPathPrefix: "44'/60'/0'/",
      index: 0,
      isLoading: true,
      numberOfAccountsPerPage: 10,
    };

    const newState = ledgerWizardReducer(state, ledgerWizardAccountsListPreviousPageAction());

    expect(newState).to.be.deep.eq({
      accounts: [],
      derivationPathPrefix: "44'/60'/0'/",
      index: 0,
      isLoading: true,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should act on SET_LEDGER_WIZARD_ACCOUNTS action", () => {
    const newState = ledgerWizardReducer(
      undefined,
      setLedgerAccountsAction({
        accounts: [{ address: "0x67", balance: "123", derivationPath: "44/60" }],
      }),
    );

    expect(newState).to.be.deep.eq({
      accounts: [{ address: "0x67", balance: "123", derivationPath: "44/60" }],
      index: 0,
      isLoading: false,
      derivationPathPrefix: "44'/60'/0'/",
      numberOfAccountsPerPage: 10,
    });
  });
});
