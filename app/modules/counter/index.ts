import {
  Delay,
  DelaySymbol,
  DispatchSymbol,
  GetState,
  GetStateSymbol,
  NavigateTo,
  NavigateToSymbol,
} from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch, AppReducer, IAppAction } from "../../store";
import { makeActionCreator, makeParameterlessActionCreator } from "../../storeHelpers";

export interface ICounterState {
  value: number;
}

export interface ICounterIncrementAction extends IAppAction {
  type: "COUNTER_INCREMENT";
  payload: {
    by: number;
  };
}

export interface ICounterDecrementAction extends IAppAction {
  type: "COUNTER_DECREMENT";
}

export const counterIncrementAction = makeActionCreator<ICounterIncrementAction>(
  "COUNTER_INCREMENT",
);

export const counterDecrementAction = makeParameterlessActionCreator<ICounterDecrementAction>(
  "COUNTER_DECREMENT",
);

const initialState: ICounterState = {
  value: 0,
};

export const counterReducer: AppReducer<ICounterState> = (
  state = initialState,
  action,
): ICounterState => {
  switch (action.type) {
    case "COUNTER_INCREMENT":
      return {
        ...state,
        value: state.value + action.payload.by,
      };
    case "COUNTER_DECREMENT":
      return {
        ...state,
        value: state.value - 1,
      };
  }

  return state;
};

export const counterAsyncAction = async (
  delay: Delay,
  dispatch: AppDispatch,
  getState: GetState,
  navigateTo: NavigateTo,
) => {
  await delay(1000);
  dispatch(counterIncrementAction({ by: 2 }));

  if (getState().counterState.value >= 10) {
    navigateTo("/success");
  }
};

export const explicitCounterAsyncAction = injectableFn(
  async (delay: Delay, dispatch: AppDispatch, getState: GetState, navigateTo: NavigateTo) => {
    await delay(1000);
    dispatch(counterIncrementAction({ by: 2 }));

    if (getState().counterState.value >= 10) {
      navigateTo("/success");
    }
  },
  [DelaySymbol, DispatchSymbol, GetStateSymbol, NavigateToSymbol],
);
