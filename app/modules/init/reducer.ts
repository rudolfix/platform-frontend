import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IInitState {
  started: boolean;
  done: boolean;
  error: boolean;
  errorMsg?: string;
}

export const initInitialState: IInitState = {
  started: false,
  done: false,
  error: false,
};

export const initReducer: AppReducer<IInitState> = (
  state = initInitialState,
  action,
): DeepReadonly<IInitState> => {
  switch (action.type) {
    case "INIT_START":
      return {
        ...state,
        started: true,
        done: false,
        error: false,
        errorMsg: undefined,
      };
    case "INIT_DONE":
      return {
        ...state,
        started: true,
        error: false,
        errorMsg: undefined,
        done: true,
      };
    case "INIT_ERROR":
      return {
        ...state,
        started: true,
        done: false,
        error: true,
        errorMsg: action.payload.errorMsg,
      };
  }

  return state;
};
