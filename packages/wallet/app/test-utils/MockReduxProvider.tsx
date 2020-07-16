import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "redux";

const emptyReducer = () => ({});

const MockReduxProvider: React.FunctionComponent = ({ children }) => {
  return <ReduxProvider store={createStore(emptyReducer)}>{children}</ReduxProvider>;
};

export { MockReduxProvider };
