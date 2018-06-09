import * as cn from "classnames";
import * as React from "react";

import { Size } from "../../types";
import { InlineIcon } from "./InlineIcon";
import { LoadingIndicator } from "./LoadingIndicator";

import * as closeIcon from "../../assets/img/inline_icons/close.svg";
import * as styles from "./Buttons.module.scss";

type TButtonLayout = "primary" | "secondary";
type TButtonTheme = "t-dark" | "t-white";
type TIconPosition = "icon-before" | "icon-after";

export interface IButtonProps {
  layout?: TButtonLayout;
  theme?: TButtonTheme;
  disabled?: boolean;
  onClick?: (event: any) => void;
  svgIcon?: string;
  type?: string;
  className?: string;
  iconPosition?: TIconPosition;
  size?: Size;
  isLoading?: boolean;
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
  isLoading,
  ...props
}) => {
  return (
    <button
      className={cn("button", layout, iconPosition, theme, size)}
      disabled={disabled || isLoading}
      tabIndex={0}
      type="button"
      {...props}
    >
      <div className={cn(styles.content, className)} tabIndex={-1}>
        {isLoading ? (
          <LoadingIndicator light />
        ) : (
          <>
            {iconPosition === "icon-before" && <InlineIcon svgIcon={svgIcon || ""} />}
            {children}
            {iconPosition === "icon-after" && <InlineIcon svgIcon={svgIcon || ""} />}
          </>
        )}
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
    <InlineIcon {...props} width="20px" height="20px" svgIcon={closeIcon} />
  </div>
);
