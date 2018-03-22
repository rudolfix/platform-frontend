import * as cn from "classnames";
import * as React from "react";
import { InlineIcon } from "./InlineIcon";

import * as styles from "./Buttons.module.scss";

import * as closeIcon from "../../assets/img/inline_icons/close.svg";

type TButtonLayout = "primary" | "secondary" | "icon-before" | "icon-after";

type TButtonTheme = "t-dark" | "t-white";

interface IButtonProps {
  layout?: TButtonLayout;
  theme?: TButtonTheme;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<any>;
  svgIcon?: string;
  type?: string;
  className?: string;
}

export const Button: React.SFC<IButtonProps> = ({
  children,
  layout,
  theme,
  disabled,
  svgIcon,
  className,
  ...props
}) => {
  const iconLayout = layout === "icon-before" || layout === "icon-after" ? "secondary" : "";
  return (
    <button
      className={cn("button", layout, iconLayout, theme)}
      disabled={disabled}
      tabIndex={0}
      {...props}
    >
      <div className={cn(styles.content, className)} tabIndex={-1}>
        {layout === "icon-before" && <InlineIcon svgIcon={svgIcon || ""} />}
        {children}
        {layout === "icon-after" && <InlineIcon svgIcon={svgIcon || ""} />}
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
  handleClick?: () => void;
}

export const ButtonClose: React.SFC<IButtonClose> = ({ ...props }) => (
  <div className={styles.buttonClose}>
    <InlineIcon {...props} svgIcon={closeIcon} />
  </div>
);
