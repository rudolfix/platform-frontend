import * as cn from "classnames";
import * as React from "react";
import { InlineIcon } from "./InlineIcon";

import * as styles from "./Buttons.module.scss";

import * as closeIcon from "../../assets/img/inline_icons/close.svg";

type TButtonLayout = "primary" | "secondary";

type TButtonTheme = "t-dark" | "t-white";

type TIconPosition = "icon-before" | "icon-after";

interface IButtonProps {
  layout?: TButtonLayout;
  theme?: TButtonTheme;
  disabled?: boolean;
  onClick?: () => void;
  svgIcon?: string;
  type?: string;
  className?: string;
  iconPosition?: TIconPosition;
}

export const Button: React.SFC<IButtonProps> = ({
  children,
  layout,
  theme,
  disabled,
  svgIcon,
  className,
  iconPosition,
  ...props
}) => {
  return (
    <button
      className={cn("button", layout, iconPosition, theme)}
      disabled={disabled}
      tabIndex={0}
      {...props}
    >
      <div className={cn(styles.content, className)} tabIndex={-1}>
        {iconPosition === "icon-before" && <InlineIcon svgIcon={svgIcon || ""} />}
        {children}
        {iconPosition === "icon-after" && <InlineIcon svgIcon={svgIcon || ""} />}
      </div>
    </button>
  );
};

Button.defaultProps = {
  layout: "primary",
  theme: "t-dark",
  disabled: false,
};

interface IButtonClose {
  onClick?: () => void;
}

export const ButtonClose: React.SFC<IButtonClose> = ({ onClick, ...props }) => (
  <div className={styles.buttonClose} onClick={onClick}>
    <InlineIcon {...props} svgIcon={closeIcon} />
  </div>
);
