import { AppReducer, IAppAction, AppDispatch } from "../../store";
import { makeActionCreator, makeParameterlessActionCreator } from "../../storeHelpers";
import { injectableFn } from "../../redux-injectify";
import {
  TDelay,
  TGetState,
  TNavigateTo,
  GetState,
  Delay,
  NavigateTo,
  Dispatch,
} from "../../getContainer";

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

export const counterAsyncAction = async (delay: TDelay, dispatch: AppDispatch) => {
  await delay(1000);
  dispatch(counterIncrementAction({ by: 2 }));
};

export const explicitCounterAsyncAction = injectableFn(
  async (delay: TDelay, dispatch: AppDispatch, getState: TGetState, navigateTo: TNavigateTo) => {
    await delay(1000);
    dispatch(counterIncrementAction({ by: 2 }));

    if (getState().counterState.value >= 10) {
      navigateTo("/success");
    }
  },
  [Delay, Dispatch, GetState, NavigateTo],
);
