import { Action, PreloadedState, Reducer, StoreEnhancerStoreCreator } from "redux";

import { actions } from "../modules/actions";
import { TAppGlobalState } from "../store";

export const reduxLogoutReset = (
  staticValues: (state: TAppGlobalState | undefined) => Partial<TAppGlobalState> | undefined,
) => (next: StoreEnhancerStoreCreator) => <S, A extends Action>(
  reducer: Reducer<S, A>,
  preloadedState: PreloadedState<S> | undefined,
) => {
  const enhanceReducer = (state: S | undefined, action: A) => {
    switch (action.type) {
      case actions.auth.logout.getType(): {
        // Need to force cast as `any` due to the way `StoreEnhancer` type is defined
        // (there is not access to provide specific store type)
        return reducer(staticValues(state as any) as any, action);
      }
    }

    return reducer(state, action);
  };

  return next(enhanceReducer, preloadedState);
};
