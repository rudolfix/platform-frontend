import { Container } from "inversify";
import * as React from "react";

import { ContainerContext } from "../../components/shared/InversifyProvider";
import { symbols } from "../../di/symbols";
import { appConnect, AppGlobalDispatch } from "../../store";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactoryType,
} from "./AsyncIntervalScheduler";

interface IActionWatcherDispatchProps {
  watchAction: () => void;
}

interface IWatchActionOptions {
  actionCreator: (dispatch: AppGlobalDispatch) => void;
  interval: number;
}

/**
 * @deprecated
 * It runs action on enter and then every defined interval.
 * It makes sure that action finishes before running it next time.
 */

export const withActionWatcher: (
  options: IWatchActionOptions,
) => (
  WrappedComponent: React.ComponentType,
) => React.ComponentClass = options => WrappedComponent =>
  appConnect<{}, IActionWatcherDispatchProps>({
    dispatchToProps: dispatch => ({
      watchAction: () => options.actionCreator(dispatch),
    }),
  })(
    class ActionWatcher extends React.Component<IActionWatcherDispatchProps> {
      static contextType = ContainerContext;

      asyncIntervalScheduler: AsyncIntervalScheduler;

      constructor(props: any, container: Container) {
        super(props);

        const asyncIntervalSchedulerFactory = container.get<AsyncIntervalSchedulerFactoryType>(
          symbols.asyncIntervalSchedulerFactory,
        );

        this.asyncIntervalScheduler = asyncIntervalSchedulerFactory(
          this.props.watchAction,
          options.interval,
        );
      }

      componentDidMount(): void {
        // initial run
        this.props.watchAction();
        this.asyncIntervalScheduler.start();
      }

      componentWillUnmount(): void {
        this.asyncIntervalScheduler.stop();
      }

      render(): React.ReactNode {
        const { watchAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
