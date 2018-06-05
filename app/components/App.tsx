import * as React from "react";
import { ToastContainer } from "react-toastify";

import { compose } from "redux";
import { appConnect } from "../store";
import { AppRouter } from "./AppRouter";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { AccessWalletModal } from "./modals/AccessWalletModal";
import { GenericModal } from "./modals/GenericModal";
import { LoadingIndicator } from "./shared/LoadingIndicator";

interface IStateProps {
  started: boolean;
  done: boolean;
  error: boolean;
  errorMsg?: string;
}

class AppComponent extends React.Component<IStateProps> {
  render(): React.ReactNode {
    if (this.props.error) {
      return <h1>Critical error occured: {this.props.errorMsg}</h1>;
    }

    if (this.props.started && !this.props.done) {
      return <LoadingIndicator />;
    }

    return (
      <>
        <Header />
        <div className="wrapper">
          <AppRouter />
        </div>
        <Footer />
        <AccessWalletModal />
        <ToastContainer />
        <GenericModal />
      </>
    );
  }
}

export const App = compose<React.ComponentClass>(
  appConnect<IStateProps>({
    stateToProps: s => ({
      started: s.init.started,
      done: s.init.done,
      error: s.init.error,
      errorMsg: s.init.errorMsg,
    }),
    options: { pure: false }, // we need this because of:https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
  }),
)(AppComponent);
