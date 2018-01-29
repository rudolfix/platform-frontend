import * as React from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../store";
import { AsyncIntervalScheduler } from "./AsyncIntervalScheduler";

interface IActionWatcherDispatchProps {
  watchAction: Function;
}

interface IWatchActionOptions {
  actionCreator: (dispatch: AppDispatch) => void;
  interval: number;
}

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
      constructor(props: any) {
        super(props);
        this.asyncIntervalScheduler = new AsyncIntervalScheduler(
          { error: () => {} } as any, // tmp solution we need to put inversify container into react context
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
