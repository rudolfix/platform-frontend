import { AppReducer } from "../../store";

export interface IGenericErrorModalState {
  isOpen: boolean;
  errorObj?: IErrorObj;
}
export interface IErrorObj {
  mainError: string;
  errorMsg: string;
}
const initialState: IGenericErrorModalState = {
  isOpen: false,
};

export const genericErrorModalReducer: AppReducer<IGenericErrorModalState> = (
  state = initialState,
  action,
): IGenericErrorModalState => {
  switch (action.type) {
    case "GENERIC_ERROR_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        errorObj: action.payload,
      };
    case "GENERIC_ERROR_MODAL_HIDE":
      return {
        ...state,
        errorObj: undefined,
        isOpen: false,
      };
  }

  return state;
};

export const selectIsSigning = (state: IGenericErrorModalState): boolean => state.isOpen;
