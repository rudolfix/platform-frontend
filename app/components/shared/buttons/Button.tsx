import * as cn from "classnames";
import * as React from "react";

import { InlineIcon } from "../InlineIcon";
import { LoadingIndicator } from "../loading-indicator";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as closeIcon from "../../../assets/img/inline_icons/close.svg";
import { CommonHtmlProps } from "../../../types";

import * as styles from "./Button.module.scss";

type TButtonTheme = "dark" | "white" | "brand" | "silver" | "graphite" | "neon";
type TIconPosition = "icon-before" | "icon-after";

export enum EButtonLayout {
  PRIMARY = styles.buttonPrimary,
  SECONDARY = styles.buttonSecondary,
  INLINE = styles.buttonInline,
  SIMPLE = styles.buttonSimple,
}

export enum ButtonSize {
  NORMAL = "",
  SMALL = "small",
  HUGE = "huge",
}

export enum ButtonWidth {
  NORMAL = "",
  WIDE = "wide",
  BLOCK = "block",
}

export enum ButtonTextPosition {
  CENTER = "",
  LEFT = "text-left",
  RIGHT = "text-right",
}

export interface IGeneralButton {
  onClick?: (event: any) => void;
}

interface IButtonIcon extends IGeneralButton {
  svgIcon: string;
  className?: string;
}

export interface IButtonProps extends IGeneralButton, CommonHtmlProps {
  layout?: EButtonLayout;
  theme?: TButtonTheme;
  disabled?: boolean;
  svgIcon?: string;
  type?: string;
  iconPosition?: TIconPosition;
  size?: ButtonSize;
  width?: ButtonWidth;
  isLoading?: boolean;
  isActive?: boolean;
  textPosition?: ButtonTextPosition;
}

const buttonThemeClassNames: Record<TButtonTheme, string> = {
  dark: styles.buttonDark,
  white: styles.buttonWhite,
  brand: styles.buttonBrand,
  silver: styles.buttonSilver,
  graphite: styles.buttonGraphite,
  neon: styles.buttonNeon,
};

const Button: React.ComponentType<
  IButtonProps & React.ClassAttributes<HTMLButtonElement>
> = React.forwardRef(
  (
    {
      children,
      layout,
      theme,
      disabled,
      svgIcon,
      className,
      iconPosition,
      size,
      width,
      isLoading,
      type,
      textPosition,
      isActive,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        styles.button,
        layout,
        iconPosition,
        {
          [buttonThemeClassNames[theme!]]: layout !== EButtonLayout.INLINE,
          [styles.isActive]: isActive,
        },
        size,
        width,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      <div className={cn(styles.content, className, textPosition)} tabIndex={-1}>
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
  ),
);

Button.defaultProps = {
  layout: EButtonLayout.PRIMARY,
  theme: "dark",
  type: "button",
  disabled: false,
  size: ButtonSize.NORMAL,
  width: ButtonWidth.NORMAL,
};

const ButtonIcon: React.SFC<IButtonIcon> = ({ onClick, className, ...props }) => (
  <button className={cn(styles.buttonIcon, className)} onClick={onClick}>
    <InlineIcon {...props} />
  </button>
);

const ButtonIconPlaceholder: React.SFC = () => <div className={styles.buttonIconPlaceholder} />;

const ButtonClose: React.SFC<IGeneralButton> = props => (
  <ButtonIcon {...props} svgIcon={closeIcon} />
);

const ButtonArrowRight: React.SFC<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.SECONDARY}
    iconPosition="icon-after"
    svgIcon={arrowRight}
  />
);

export { ButtonIcon, ButtonIconPlaceholder, ButtonClose, ButtonArrowRight, Button };
