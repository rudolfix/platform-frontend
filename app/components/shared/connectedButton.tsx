import * as React from "react";
import { compose } from "redux";
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
      isLocked: s.connectedButtonState.isButtonLocked,
    }),
  }),
)(ConnectedButtonComponent);

//TODO: Use selector for isLocked
