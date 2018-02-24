import * as React from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../store";

interface IOnEnterActionDispatchProps {
  enterAction: Function;
}

interface IOnEnterActionOptions {
  actionCreator: (dispatch: AppDispatch) => void;
  pure?: boolean;
}

export const onEnterAction: (
  options: IOnEnterActionOptions,
) => (
  WrappedComponent: React.ComponentType,
) => React.ComponentClass = options => WrappedComponent =>
  connect<{}, IOnEnterActionDispatchProps>(
    undefined,
    dispatch => ({
      enterAction: () => options.actionCreator(dispatch),
    }),
    undefined,
    {
      pure: "pure" in options ? options.pure : true,
    },
  )(
    class OnEnterAction extends React.Component<IOnEnterActionDispatchProps> {
      constructor(props: any) {
        super(props);
      }

      public componentDidMount(): void {
        this.props.enterAction();
      }

      public render(): React.ReactNode {
        const { enterAction, ...componentProps } = this.props;
        return <WrappedComponent {...componentProps} />;
      }
    },
  );
