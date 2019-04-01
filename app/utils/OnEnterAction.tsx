import * as React from "react";
import { connect } from "react-redux";

import { AppDispatch } from "../store";

interface IOnEnterActionDispatchProps {
  enterAction: Function;
}

interface IOnEnterActionOptions<P = {}> {
  actionCreator: (dispatch: AppDispatch, props: P) => void;
  pure?: boolean;
}

export const onEnterAction = <P extends object = {}>(options: IOnEnterActionOptions<P>) => (
  WrappedComponent: React.ComponentType,
) =>
  connect<{}, IOnEnterActionDispatchProps, P>(
    undefined,
    (dispatch, props) => ({
      enterAction: () => options.actionCreator(dispatch, props),
    }),
    undefined,
    {
      pure: options.pure,
    },
  )(
    class OnEnterAction extends React.Component<IOnEnterActionDispatchProps> {
      componentDidMount(): void {
        this.props.enterAction();
      }

      render(): React.ReactNode {
        const { enterAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
