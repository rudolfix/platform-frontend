import { AppReducer } from "../../store";

export interface IGenericModalState {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
}

//Add more custom icons here
export type icon = "check" | "exclamation";

export interface IGenericModal {
  title: string;
  description?: string;
  icon?: icon;
}

const initialState: IGenericModalState = {
  isOpen: false,
};

export const genericModalReducer: AppReducer<IGenericModalState> = (
  state = initialState,
  action,
): IGenericModalState => {
  switch (action.type) {
    case "GENERIC_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        genericModalObj: action.payload,
      };
    case "GENERIC_MODAL_HIDE":
      return {
        ...state,
        genericModalObj: undefined,
        isOpen: false,
      };
  }

  return state;
};

export const selectIsOpen = (state: IGenericModalState): boolean => state.isOpen;
export const selectGenericModalObj = (state: IGenericModalState): IGenericModal | undefined =>
  state.genericModalObj;
