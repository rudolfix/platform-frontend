import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "redux";
import configureStore from "redux-mock-store";

import { IAppState, reducers } from "../store";
import { DeepPartial } from "../types";

const mockStore = configureStore();

export const withStore = (initialState?: DeepPartial<IAppState>) => (story: any): any => {
  const store = createStore(reducers, initialState as any);

  return <ReduxProvider store={store}>{story()}</ReduxProvider>;
};

export const withMockStore = (initialState?: DeepPartial<IAppState>) => (
  node: React.ReactNode,
): {
  store: any;
  node: React.ReactElement<ReduxProvider>;
} => {
  const store = mockStore(initialState);

  return {
    store,
    node: <ReduxProvider store={store}>{node}</ReduxProvider>,
  };
};
