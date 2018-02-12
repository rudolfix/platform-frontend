import * as React from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";

import { Web3Manager, Web3ManagerSymbol } from "../modules/web3/Web3Manager";
import { injectableFn } from "../redux-injectify";
import { AppRouter } from "./AppRouter";
import { LoadingIndicator } from "./LoadingIndicator";

const appInitAction = injectableFn(
  async (web3Manager: Web3Manager) => {
    await web3Manager.initialize();
  },
  [Web3ManagerSymbol],
);

interface IInitializationDispatchProps {
  appInitAction: Function;
}

interface IInitializationState {
  isInitialized: boolean;
  errored: boolean;
  errorMsg?: string;
}

class AppComponent extends React.Component<IInitializationDispatchProps, IInitializationState> {
  constructor(props: IInitializationDispatchProps) {
    super(props);

    this.state = {
      isInitialized: false,
      errored: false,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      await this.props.appInitAction();
      this.setState({
        isInitialized: true,
      });
    } catch (e) {
      this.setState({
        isInitialized: false,
        errored: true,
        errorMsg: e.message,
      });
    }
  }

  render(): React.ReactNode {
    if (this.state.errored) {
      return <h1>Critical error occured: {this.state.errorMsg}</h1>;
    }

    if (!this.state.isInitialized) {
      return <LoadingIndicator />;
    }

    return (
      <div>
        <ToastContainer />
        <AppRouter />
      </div>
    );
  }
}

export const App = connect<{}, IInitializationDispatchProps>(
  undefined,
  dispatch => ({
    appInitAction: () => dispatch(appInitAction),
  }),
  undefined,
  { pure: false }, // we need this because of:https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
)(AppComponent);
