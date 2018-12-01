import * as React from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../store";

interface IOnLeaveActionDispatchProps {
  enterAction: Function;
}

interface IOnLeaveActionOptions {
  actionCreator: (dispatch: AppDispatch, props: any) => void;
  pure?: boolean;
}

/**
 * This should be merged with OnEnterAction HOC
 */
export const onLeaveAction: (
  options: IOnLeaveActionOptions,
) => (
  WrappedComponent: React.ComponentType,
) => React.ComponentClass = options => WrappedComponent =>
  connect<{}, IOnLeaveActionDispatchProps>(
    undefined,
    (dispatch, props) => ({
      enterAction: () => options.actionCreator(dispatch, props),
    }),
    undefined,
    {
      pure: "pure" in options ? options.pure : true,
    },
  )(
    class OnLeaveAction extends React.Component<IOnLeaveActionDispatchProps> {
      constructor(props: any) {
        super(props);
      }

      public componentWillUnmount(): void {
        this.props.enterAction();
      }

      public render(): React.ReactNode {
        const { enterAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
