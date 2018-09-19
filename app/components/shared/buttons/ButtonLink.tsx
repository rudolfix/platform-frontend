import { LocationDescriptor } from "history";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { Omit } from "../../../types";
import { Button, IButtonProps, IGeneralButton } from "./Button";

type TButtonLinkExternalProps = {
  to: LocationDescriptor;
  component?: React.ComponentType<IButtonProps>;
};

type TButtonWithoutOnClick = Omit<IButtonProps, IGeneralButton>;

type TProps = TButtonLinkExternalProps & RouteComponentProps<any> & TButtonWithoutOnClick;

const LinkButtonComponent: React.SFC<TProps> = ({
  to,
  history,
  children,
  component: Component = Button,
  ...rest
}) => (
  <Component
    {...rest}
    onClick={() => {
      history.push(to as any);
    }}
  >
    {children}
  </Component>
);

export const ButtonLink = withRouter(LinkButtonComponent);
