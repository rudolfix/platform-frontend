import * as cn from "classnames";
import * as React from "react";

import { Size } from "../../types";
import { InlineIcon } from "./InlineIcon";

import * as closeIcon from "../../assets/img/inline_icons/close.svg";
import * as styles from "./Buttons.module.scss";

type TButtonLayout = "primary" | "secondary";

type TButtonTheme = "t-dark" | "t-white";

type TIconPosition = "icon-before" | "icon-after";

interface IGeneralButton {
  onClick?: () => void;
}

interface IButtonIcon extends IGeneralButton {
  svgIcon: string;
}
export interface IButtonProps {
  layout?: TButtonLayout;
  theme?: TButtonTheme;
  disabled?: boolean;
  onClick?: () => void;
  svgIcon?: string;
  type?: string;
  className?: string;
  iconPosition?: TIconPosition;
  size?: Size;
}

export const Button: React.SFC<IButtonProps> = ({
  children,
  layout,
  theme,
  disabled,
  svgIcon,
  className,
  iconPosition,
  size,
  ...props
}) => {
  return (
    <button
      className={cn("button", layout, iconPosition, theme, size)}
      disabled={disabled}
      tabIndex={0}
      type="button"
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

export const ButtonClose: React.SFC<IGeneralButton> = ({ onClick, ...props }) => (
  <div className={styles.buttonClose} onClick={onClick}>
    <InlineIcon {...props} width="20px" height="20px" svgIcon={closeIcon} />
  </div>
);

export const ButtonIcon: React.SFC<IButtonIcon> = ({ onClick, ...props }) => (
  <div className={styles.buttonClose} onClick={onClick}>
    <InlineIcon {...props} width="20px" height="20px" />
  </div>
);
