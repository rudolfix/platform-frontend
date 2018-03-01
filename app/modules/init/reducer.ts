import { AppReducer } from "../../store";

export interface IInitState {
  done: boolean;
  error: boolean;
  errorMsg?: string;
}

export const initInitialState: IInitState = {
  done: false,
  error: false,
};

export const initReducer: AppReducer<IInitState> = (
  state = initInitialState,
  action,
): IInitState => {
  switch (action.type) {
    case "INIT_DONE":
      return {
        ...state,
        error: false,
        errorMsg: undefined,
        done: true,
      };
    case "INIT_ERROR":
      return {
        ...state,
        done: false,
        error: true,
        errorMsg: action.payload.errorMsg,
      };
  }

  return state;
};
