import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../store";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactorySymbol,
  AsyncIntervalSchedulerFactoryType,
} from "./AsyncIntervalScheduler";
import { IInversifyProviderContext } from "./InversifyProvider";

interface IActionWatcherDispatchProps {
  watchAction: Function;
}

interface IWatchActionOptions {
  actionCreator: (dispatch: AppDispatch) => void;
  interval: number;
}

/**
 * It runs action on enter and then every defined interval.
 * It makes sure that action finishes before running it next time.
 */
export const withActionWatcher: (
  options: IWatchActionOptions,
) => (
  WrappedComponent: React.ComponentType,
) => React.ComponentClass = options => WrappedComponent =>
  connect<{}, IActionWatcherDispatchProps>(undefined, dispatch => ({
    watchAction: () => options.actionCreator(dispatch),
  }))(
    class ActionWatcher extends React.Component<IActionWatcherDispatchProps> {
      private asyncIntervalScheduler: AsyncIntervalScheduler;
      static contextTypes = {
        container: PropTypes.object,
      };

      constructor(props: any, context: IInversifyProviderContext) {
        super(props, context);
        const asyncIntervalSchedulerFactory = context.container.get<
          AsyncIntervalSchedulerFactoryType
        >(AsyncIntervalSchedulerFactorySymbol);
        this.asyncIntervalScheduler = asyncIntervalSchedulerFactory(
          this.props.watchAction,
          options.interval,
        );
      }

      public componentDidMount(): void {
        // initial run
        this.props.watchAction();
        this.asyncIntervalScheduler.start();
      }

      public componentWillUnmount(): void {
        this.asyncIntervalScheduler.stop();
      }

      public render(): React.ReactNode {
        const { watchAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
