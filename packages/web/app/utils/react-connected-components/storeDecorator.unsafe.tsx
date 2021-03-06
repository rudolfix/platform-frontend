import { DeepPartial } from "@neufund/shared-utils";
import { createBrowserHistory } from "history";
import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { combineReducers, Reducer } from "redux";
import configureStore, { MockStore } from "redux-mock-store";

import { generateRootModuleReducerMap, TAppGlobalState } from "../../store";

const mockStore = configureStore();

const rootReducer = combineReducers(generateRootModuleReducerMap(createBrowserHistory()));

type TAppState = typeof rootReducer extends Reducer<infer S> ? S : never;

export const withStore = (initialState?: DeepPartial<TAppGlobalState>) => (
  story: () => React.ReactNode,
): any => {
  const store = mockStore(initialState);
  return <ReduxProvider store={store}>{story()}</ReduxProvider>;
};

export const withMockStore = (initialState: DeepPartial<TAppState> = {}) => (
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
