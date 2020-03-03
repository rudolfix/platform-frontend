import { createBrowserHistory } from "history";
import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { combineReducers, createStore } from "redux";
import configureStore, { MockStore } from "redux-mock-store";

import { TAction } from "../../modules/actions";
import { generateRootModuleReducerMap, TAppGlobalState } from "../../store";
import { DeepPartial } from "../../types";

const mockStore = configureStore();

const rootReducer = combineReducers(generateRootModuleReducerMap(createBrowserHistory()));

export const withStore = (initialState?: DeepPartial<TAppGlobalState>) => (
  story: () => React.ReactNode,
): any => {
  const store = createStore<TAppGlobalState, TAction, unknown, unknown>(
    rootReducer,
    initialState as any,
  );

  return <ReduxProvider store={store}>{story()}</ReduxProvider>;
};

export const withMockStore = (initialState?: DeepPartial<TAppGlobalState>) => (
  node: React.ReactNode,
): {
  store: MockStore;
  node: React.ReactElement<ReduxProvider>;
} => {
  const store = mockStore(initialState);

  return {
    store,
    node: <ReduxProvider store={store}>{node}</ReduxProvider>,
  };
};

export const withSuspense = () => (story: () => React.ReactNode): React.ReactNode => (
  <React.Suspense fallback={() => "Loading chunks..."}>{story()}</React.Suspense>
);
