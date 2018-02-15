import { AppReducer } from "../../../store";

export const DEFAULT_DERIVATION_PATH_PREFIX = "44'/60'/0'/";
export const DEFAULT_LEDGER_ACCOUNTS_PER_PAGE = 10;

export interface ILedgerAccount {
  address: string;
  derivationPath: string;
  balanceETH: string;
  balanceNEU: string;
}

export interface ILedgerWizardState {
  isConnectionEstablished: boolean;
  errorMsg?: string;
  isLoadingAddresses: boolean;
  derivationPathPrefix: string; // TODO: it can be optional, not required for advanced - false
  index: number; // TODO: it can be optional, not required for advanced - false
  numberOfAccountsPerPage: number; // TODO: it can be optional, not required for advanced - false
  accounts: ILedgerAccount[];
  advanced: boolean;
}

export const ledgerWizardInitialState: ILedgerWizardState = {
  isConnectionEstablished: false,
  isLoadingAddresses: true,
  derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
  index: 0,
  numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
  accounts: [],
  advanced: false,
};

export const ledgerWizardReducer: AppReducer<ILedgerWizardState> = (
  state = ledgerWizardInitialState,
  action,
): ILedgerWizardState => {
  switch (action.type) {
    case "LEDGER_CONNECTION_ESTABLISHED":
      return {
        ...state,
        isConnectionEstablished: true,
        errorMsg: undefined,
      };
    case "LEDGER_CONNECTION_ESTABLISHED_ERROR":
      return {
        ...state,
        isConnectionEstablished: false,
        errorMsg: action.payload.errorMsg,
      };
    case "LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE":
      return {
        ...state,
        index: state.index + 1,
        accounts: [],
        isLoadingAddresses: true,
      };
    case "LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE":
      return {
        ...state,
        index: state.index === 0 ? state.index : state.index - 1,
        accounts: [],
        isLoadingAddresses: true,
      };
    case "SET_LEDGER_WIZARD_ACCOUNTS": {
      // There is a possibility of race condition in the app when we get account lists from ledger which is async
      // operation. That's why we need to check if list that was received matches derivation path prefix that is
      // currently set.
      if (!state.advanced || state.derivationPathPrefix === action.payload.derivationPathPrefix) {
        return {
          ...state,
          accounts: action.payload.accounts,
          isLoadingAddresses: false,
        };
      }
      break;
    }
    case "SET_LEDGER_WIZARD_DERIVATION_PATH_PREFIX":
      return {
        ...state,
        derivationPathPrefix: action.payload.derivationPathPrefix,
        index: 0,
        accounts: [],
        isLoadingAddresses: true,
      };
    case "LEDGER_WIZARD_DERIVATION_PATH_PREFIX_ERROR":
      return {
        ...state,
        derivationPathPrefix: "",
        accounts: [],
      };
    case "TOGGLE_LEDGER_WIZARD_ADVANCED":
      return {
        ...state,
        isLoadingAddresses: true,
        advanced: !state.advanced,
      };
  }

  return state;
};

export function selectHasPreviousPage(state: ILedgerWizardState): boolean {
  return state.index > 0;
}
