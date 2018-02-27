import * as cn from "classnames";
import * as React from "react";
import { Button, ButtonProps } from "reactstrap";

import * as styles from "./Buttons.module.scss";

export const ButtonPrimary: React.SFC<ButtonProps> = ({ className, children, ...props }) => (
  <Button className={cn(styles.buttonPrimary, className)} {...props}>
    {children}
  </Button>
);

export const ButtonSecondary: React.SFC<ButtonProps> = ({ className, children, ...props }) => (
  <Button className={cn(styles.buttonSecondary, className)} {...props}>
    {children}
  </Button>
);
