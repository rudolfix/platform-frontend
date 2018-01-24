import * as React from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../store";

interface IOnEnterActionDispatchProps {
  watchAction: Function;
}

interface IOnEnterActionOptions {
  actionCreator: (dispatch: AppDispatch) => void;
}

export const onEnterAction: (
  options: IOnEnterActionOptions,
) => (
  WrappedComponent: React.ComponentType,
) => React.ComponentClass = options => WrappedComponent =>
  connect<{}, IOnEnterActionDispatchProps>(undefined, dispatch => ({
    watchAction: () => options.actionCreator(dispatch),
  }))(
    class OnEnterAction extends React.Component<IOnEnterActionDispatchProps> {
      constructor(props: any) {
        super(props);
      }

      public componentDidMount(): void {
        this.props.watchAction();
      }

      public render(): React.ReactNode {
        const { watchAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
