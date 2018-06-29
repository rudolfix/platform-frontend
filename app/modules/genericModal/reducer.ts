import { genericModalIcons } from "../../components/modals/GenericModal";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IGenericModalState {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
}

//Add more custom icons here
export type TIconType = keyof typeof genericModalIcons;

export interface IGenericModal {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: TIconType;
}

const initialState: IGenericModalState = {
  isOpen: false,
};

export const genericModalReducer: AppReducer<IGenericModalState> = (
  state = initialState,
  action,
): DeepReadonly<IGenericModalState> => {
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
