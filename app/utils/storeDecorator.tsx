import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "redux";

import { IAppState, reducers } from "../store";
import { DeepPartial } from "../types";

export const withStore = (initialState?: DeepPartial<IAppState>) => (story: any): any => {
  const store = createStore(reducers, initialState as any);

  return <ReduxProvider store={store}>{story()}</ReduxProvider>;
};
