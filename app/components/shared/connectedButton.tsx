import * as React from "react";
import { compose } from "redux";
import { selectIsConnectedButtonLocked } from "../../modules/connectedButtton/reducer";
import { appConnect } from "../../store";
import { Button, IButtonProps } from "./Buttons";

interface IStateProps {
  isLocked: boolean;
}

const ConnectedButtonComponent: React.SFC<IButtonProps & IStateProps> = ({
  disabled,
  isLocked,
  ...props
}) => {
  return <Button disabled={disabled || isLocked} {...props} />;
};

export const ConnectedButton = compose<React.SFC<IButtonProps>>(
  appConnect<IStateProps, IButtonProps>({
    stateToProps: s => ({
      isLocked: selectIsConnectedButtonLocked(s.connectedButtonState),
    }),
  }),
)(ConnectedButtonComponent);
