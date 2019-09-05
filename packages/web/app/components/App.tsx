import { Container } from "inversify";
import * as React from "react";
import { hot } from "react-hot-loader/root";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { symbols } from "../di/symbols";
import { ILogger } from "../lib/dependencies/logger";
import { actions } from "../modules/actions";
import { EInitType } from "../modules/init/reducer";
import { selectInitError, selectIsInitInProgress } from "../modules/init/selectors";
import { appConnect } from "../store";
import { ContainerContext } from "../utils/InversifyProvider";
import { onEnterAction } from "../utils/OnEnterAction";
import { ScrollToTop } from "../utils/ScrollToTop.unsafe";
import { withRootMetaTag } from "../utils/withMetaTags.unsafe";
import { AppRouter } from "./AppRouter";
import { CriticalError } from "./layouts/CriticalError";
import { GenericModal } from "./modals/GenericModal";
import { VideoModal } from "./modals/VideoModal";
import { AccessWalletModal } from "./modals/wallet-access/AccessWalletModal";
import { LoadingIndicator } from "./shared/loading-indicator/LoadingIndicator";
import { ToastContainer } from "./shared/Toast";

interface IState {
  renderingError: Error | null;
}

interface IStateProps {
  inProgress: boolean;
  error?: string;
}

class AppComponent extends React.Component<IStateProps, IState> {
  static contextType = ContainerContext;

  logger: ILogger;

  constructor(props: IStateProps, container: Container) {
    super(props);

    this.state = { renderingError: null };

    this.logger = container.get<ILogger>(symbols.logger);
  }

  componentDidCatch(error: Error, errorInfo: object): void {
    this.setState({ renderingError: error });

    this.logger.fatal("Fatal app error", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.renderingError) {
      return <CriticalError message={this.state.renderingError.message} />;
    }

    return (
      <>
        <ScrollToTop>
          <AppRouter />
        </ScrollToTop>
        <AccessWalletModal />
        <ToastContainer />
        <GenericModal />
        <VideoModal />
      </>
    );
  }
}

const App = compose<React.ComponentClass>(
  withRootMetaTag(),
  onEnterAction({
    actionCreator: d => d(actions.init.start(EInitType.APP_INIT)),
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      inProgress: selectIsInitInProgress(s.init),
      error: selectInitError(s.init),
    }),
    options: { pure: false }, // we need this because of:https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
  }),
  branch<IStateProps>(state => !!state.error, renderComponent(CriticalError)),
  branch<IStateProps>(state => state.inProgress, renderComponent(LoadingIndicator)),
)(AppComponent);

const AppHot = hot(App);

export { AppHot as App };
