import { expect } from "chai";
import {
  ledgerConnectionEstablishedAction,
  ledgerConnectionEstablishedErrorAction,
  ledgerWizardAccountsListNextPageAction,
  ledgerWizardAccountsListPreviousPageAction,
  ledgerWizardDerivationPathPrefixAction,
  setLedgerAccountsAction,
  setLedgerWizardDerivationPathPrefix,
} from "../../../../app/modules/wallet-selector/ledger-wizard/actions";
import {
  DEFAULT_DERIVATION_PATH_PREFIX,
  ILedgerWizardState,
  ledgerWizardInitialState,
  ledgerWizardReducer,
} from "../../../../app/modules/wallet-selector/ledger-wizard/reducer";

describe("Wallet selector > Ledger wizard > reducer", () => {
  it("should act on LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE action", () => {
    const newState = ledgerWizardReducer(undefined, ledgerWizardAccountsListNextPageAction());

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 1,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should act on LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE action", () => {
    const state: ILedgerWizardState = {
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 1,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: 10,
    };

    const newState = ledgerWizardReducer(state, ledgerWizardAccountsListPreviousPageAction());

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 0,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should do nothing on LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE action when its first page", () => {
    const state: ILedgerWizardState = {
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 0,
      isLoadingAddresses: true,
      numberOfAccountsPerPage: 10,
    };

    const newState = ledgerWizardReducer(state, ledgerWizardAccountsListPreviousPageAction());

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: true,
      accounts: [],
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      index: 0,
      isLoadingAddresses: true,
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
      isConnectionEstablished: false,
      accounts: [{ address: "0x67", balance: "123", derivationPath: "44/60" }],
      index: 0,
      isLoadingAddresses: false,
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should act on LEDGER_CONNECTION_ESTABLISHED action", () => {
    const action = ledgerConnectionEstablishedAction();
    const initialState = {
      ...ledgerWizardInitialState,
      errorMsg: "some error",
    };

    const newState = ledgerWizardReducer(initialState, action);

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: true,
      errorMsg: undefined,
      accounts: [],
      index: 0,
      isLoadingAddresses: true,
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should act on LEDGER_CONNECTION_ESTABLISHED_ERROR action", () => {
    const expectedErrorMsg = "LEDGER ERROR";
    const action = ledgerConnectionEstablishedErrorAction({ errorMsg: expectedErrorMsg });

    const newState = ledgerWizardReducer(undefined, action);

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      errorMsg: expectedErrorMsg,
      accounts: [],
      index: 0,
      isLoadingAddresses: true,
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should act on SET_LEDGER_WIZARD_DERIVATION_PATH_PREFIX", () => {
    const newDerivationPath = "test";
    const newState = ledgerWizardReducer(
      undefined,
      setLedgerWizardDerivationPathPrefix({ derivationPathPrefix: newDerivationPath }),
    );

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      isLoadingAddresses: true,
      accounts: [],
      index: 0,
      derivationPathPrefix: newDerivationPath,
      numberOfAccountsPerPage: 10,
    });
  });

  it("should act on LEDGER_WIZARD_DERIVATION_PATH_PREFIX_ERROR", () => {
    const newState = ledgerWizardReducer(undefined, ledgerWizardDerivationPathPrefixAction());

    expect(newState).to.be.deep.eq({
      isConnectionEstablished: false,
      isLoadingAddresses: true,
      accounts: [],
      index: 0,
      derivationPathPrefix: "",
      numberOfAccountsPerPage: 10,
    });
  });
});
