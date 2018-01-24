import * as React from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../store";

interface IActionWatcherState {
  timerId?: number;
}

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
    class ActionWatcher extends React.Component<IActionWatcherDispatchProps, IActionWatcherState> {
      constructor(props: any) {
        super(props);
      }

      public componentDidMount(): void {
        // initial run
        this.props.watchAction();
        const timerId = window.setInterval(this.props.watchAction, options.interval);
        this.setState({
          ...this.state,
          timerId,
        });
      }

      public componentWillUnmount(): void {
        window.clearInterval(this.state.timerId!);
      }

      public render(): React.ReactNode {
        const { watchAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
