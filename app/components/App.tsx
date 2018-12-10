import * as PropTypes from "prop-types";
import * as React from "react";
import { ToastContainer } from "react-toastify";
import { compose } from "redux";

import { TOAST_COMPONENT_DELAY } from "../config/constants";
import { symbols } from "../di/symbols";
import { ILogger } from "../lib/dependencies/Logger";
import { actions } from "../modules/actions";
import {
  selectInitError,
  selectIsInitDone,
  selectIsInitInProgress,
} from "../modules/init/selectors";
import { appConnect } from "../store";
import { IInversifyProviderContext } from "../utils/InversifyProvider";
import { onEnterAction } from "../utils/OnEnterAction";
import { ScrollToTop } from "../utils/ScrollToTop";
import { AppRouter } from "./AppRouter";
import { CriticalError } from "./layouts/CriticalError";
import { GenericModal } from "./modals/GenericModal";
import { VideoModal } from "./modals/VideoModal";
import { AccessWalletModal } from "./modals/walletAccess/AccessWalletModal";
import { LoadingIndicator } from "./shared/loading-indicator";

interface IState {
  renderingError: Error | null;
}

interface IStateProps {
  inProgress: boolean;
  done: boolean;
  error?: string;
}

class AppComponent extends React.Component<IStateProps, IState> {
  static contextTypes = {
    container: PropTypes.object,
  };

  logger: ILogger;

  constructor(props: any, context: IInversifyProviderContext) {
    super(props);

    this.state = { renderingError: null };

    this.logger = context.container.get<ILogger>(symbols.logger);
  }

  componentDidCatch(error: Error, errorInfo: object): void {
    this.setState({ renderingError: error });

    this.logger.fatal("Fatal app error", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.props.error) {
      return <CriticalError message={this.props.error} />;
    }

    if (this.state.renderingError) {
      return <CriticalError message={this.state.renderingError.message} />;
    }

    if (this.props.inProgress) {
      return <LoadingIndicator />;
    }

    return (
      <>
        <ScrollToTop>
          <AppRouter />
        </ScrollToTop>

        <AccessWalletModal />
        <ToastContainer autoClose={TOAST_COMPONENT_DELAY} />
        <GenericModal />
        <VideoModal />
      </>
    );
  }
}

export const App = compose<React.ComponentClass>(
  onEnterAction({
    actionCreator: d => d(actions.init.start("appInit")),
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      inProgress: selectIsInitInProgress(s.init),
      done: selectIsInitDone(s.init),
      error: selectInitError(s.init),
    }),
    options: { pure: false }, // we need this because of:https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
  }),
)(AppComponent);
