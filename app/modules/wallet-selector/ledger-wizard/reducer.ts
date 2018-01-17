import { AppReducer } from "../../../store";

const DEFAULT_DERIVATION_PATH_PREFIX = "44'/60'/0'/";
const DEFAULT_LEDGER_ACCOUNTS_PER_PAGE = 10;

export interface ILedgerAccount {
  address: string;
  derivationPath: string;
  balance: string;
}

export interface ILedgerWizardState {
  isLoading: boolean;
  derivationPathPrefix: string;
  index: number;
  numberOfAccountsPerPage: number;
  accounts: ILedgerAccount[];
}

const initialState: ILedgerWizardState = {
  isLoading: true,
  derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
  index: 0,
  numberOfAccountsPerPage: DEFAULT_LEDGER_ACCOUNTS_PER_PAGE,
  accounts: [],
};

export const ledgerWizardReducer: AppReducer<ILedgerWizardState> = (
  state = initialState,
  action,
): ILedgerWizardState => {
  switch (action.type) {
    case "LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE":
      return {
        ...state,
        index: state.index + 1,
        accounts: [],
        isLoading: true,
      };
    case "LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE":
      return {
        ...state,
        index: state.index === 0 ? state.index : state.index - 1,
        accounts: [],
        isLoading: true,
      };
    case "SET_LEDGER_WIZARD_ACCOUNTS":
      return {
        ...state,
        accounts: action.payload.accounts,
        isLoading: false,
      };
  }

  return state;
};
