import * as cn from "classnames";
import * as React from "react";
import { Link, LinkProps } from "react-router-dom";
import { Button, ButtonProps } from "reactstrap";
import { InlineIcon } from "./InlineIcon";

import * as styles from "./Buttons.module.scss";

import * as closeIcon from "../../assets/img/inline_icons/close.svg";

export const ButtonPrimary: React.SFC<ButtonProps> = ({ className, children, ...props }) => (
  <Button className={cn(styles.buttonPrimary, className)} {...props}>
    {children}
  </Button>
);

export const ButtonPrimaryLink: React.SFC<LinkProps> = ({ className, ...props }) => (
  <Link className={cn(className, styles.buttonPrimary, "btn")} {...props} />
);

export const ButtonSecondary: React.SFC<ButtonProps> = ({ className, children, ...props }) => (
  <Button className={cn(styles.buttonSecondary, className)} {...props}>
    {children}
  </Button>
);

export const ButtonSecondaryLink: React.SFC<LinkProps> = ({ className, ...props }) => (
  <Link className={cn(className, styles.buttonSecondary, "btn")} {...props} />
);

interface IButtonClose {
  handleClick?: () => void;
}

export const ButtonClose: React.SFC<IButtonClose> = ({ handleClick, ...props }) => (
  <div className={styles.buttonClose} onClick={handleClick}>
    <InlineIcon {...props} svgIcon={closeIcon} />
  </div>
);
