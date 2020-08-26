import { invariant, PartialByKeys, TDataTestId } from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";

import { InlineIcon } from "../icons/InlineIcon";
import { LoadingIndicator } from "../loading-indicator";
import { ButtonBase } from "./ButtonBase";

import * as styles from "./Button.module.scss";

enum EIconPosition {
  ICON_BEFORE = "icon-before",
  ICON_AFTER = "icon-after",
}

enum EButtonLayout {
  PRIMARY = styles.buttonPrimary,
  SECONDARY = styles.buttonSecondary,
  LINK = styles.buttonLink,
}

enum EButtonSize {
  NORMAL,
  SMALL = styles.buttonSmall,
  HUGE = styles.buttonHuge,
  DYNAMIC = styles.buttonDynamic,
  EXTRA_SMALL = styles.buttonExtraSmall,
}

enum EButtonWidth {
  NORMAL,
  BLOCK = styles.buttonBlock,
  NO_PADDING = styles.buttonNoPadding,
}

type TButtonLayout = {
  layout: EButtonLayout;
  size: EButtonSize;
  width: EButtonWidth;
  isLoading?: boolean;
  isActive?: boolean;
};

const ButtonLayout = React.forwardRef<
  HTMLButtonElement,
  TButtonLayout & React.ComponentProps<typeof ButtonBase> & TDataTestId
>(({ children, className, layout, disabled, size, width, isLoading, isActive, ...props }, ref) => (
  <ButtonBase
    ref={ref}
    className={cn(
      styles.button,
      className,
      layout,
      {
        [styles.buttonIsActive]: isActive,
      },
      size,
      width,
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <>
        {/*
                &nbsp; makes button the same in height as normal button
                (avoids height jumping after switching to loading state)
              */}
        &nbsp;
        <LoadingIndicator light />
        &nbsp;
      </>
    ) : (
      children
    )}
  </ButtonBase>
));

type ButtonLayoutProps = React.ComponentProps<typeof ButtonLayout>;

type TButtonProps = {
  svgIcon?: string;
  iconPosition?: EIconPosition;
  iconProps?: Omit<React.ComponentProps<typeof InlineIcon>, "svgIcon">;
} & PartialByKeys<ButtonLayoutProps, "layout" | "size" | "width">;

const Button = React.forwardRef<HTMLButtonElement, TButtonProps>(
  (
    {
      layout = EButtonLayout.SECONDARY,
      size = EButtonSize.NORMAL,
      width = EButtonWidth.NORMAL,
      className,
      children,
      svgIcon,
      iconPosition,
      iconProps = {},
      ...props
    },
    ref,
  ) => {
    const withIconOnly = children === undefined;

    if (__DEV__) {
      invariant(
        !(svgIcon === undefined && withIconOnly),
        "Either `svgIcon` or `children` should be provided to a button",
      );
      invariant(
        !(withIconOnly && iconProps.alt === undefined),
        "For proper accessibility in case button contains only icon `iconProps.alt` should be provided",
      );
    }

    return (
      <ButtonLayout
        ref={ref}
        layout={layout}
        size={size}
        width={width}
        className={cn(className, { [styles.buttonOnlyIcon]: withIconOnly })}
        {...props}
      >
        {!withIconOnly && svgIcon && iconPosition === EIconPosition.ICON_BEFORE && (
          <InlineIcon
            {...iconProps}
            className={cn(styles.buttonIcon, styles.buttonIconBefore, iconProps.className)}
            svgIcon={svgIcon}
          />
        )}

        {withIconOnly && svgIcon ? (
          <>
            {/*
                &nbsp; makes button the same in height as normal button
                (avoids height jumping after switching to loading state)
              */}
            &nbsp;
            <InlineIcon
              {...iconProps}
              className={cn(styles.buttonIcon, iconProps.className)}
              svgIcon={svgIcon}
            />
            &nbsp;
          </>
        ) : (
          children
        )}

        {!withIconOnly && svgIcon && iconPosition === EIconPosition.ICON_AFTER && (
          <InlineIcon
            {...iconProps}
            className={cn(styles.buttonIcon, styles.buttonIconAfter, iconProps.className)}
            svgIcon={svgIcon}
          />
        )}
      </ButtonLayout>
    );
  },
);

export { Button, EButtonLayout, EButtonSize, EButtonWidth, EIconPosition, TButtonProps };
