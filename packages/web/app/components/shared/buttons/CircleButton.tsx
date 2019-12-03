import * as cn from "classnames";
import * as React from "react";

import { OmitKeys } from "../../../types";
import { invariant } from "../../../utils/invariant";
import { InlineIcon } from "../icons/InlineIcon";
import { ButtonBase } from "./ButtonBase";

import * as styles from "./CircleButton.module.scss";

enum ECircleButtonLayout {
  DANGER = styles.circleButtonDanger,
  SECONDARY = styles.circleButtonSecondary,
}

enum ECircleButtonIconPosition {
  ICON_BEFORE = "icon-before",
  ICON_AFTER = "icon-after",
}

type TButtonBaseProps = React.ComponentProps<typeof ButtonBase>;

type TExternalProps = {
  svgIcon?: string;
  iconPosition?: ECircleButtonIconPosition;
  iconProps?: OmitKeys<React.ComponentProps<typeof InlineIcon>, "svgIcon">;
  layout: ECircleButtonLayout;
};

const CircleButton: React.FunctionComponent<TExternalProps & TButtonBaseProps> = ({
  layout,
  children,
  className,
  svgIcon,
  iconProps = {},
  iconPosition,
  ...props
}) => {
  const withIconOnly = children === undefined;

  if (process.env.NODE_ENV === "development") {
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
    <ButtonBase
      className={cn(className, layout, styles.circleButton, {
        [styles.circleButtonOnlyIcon]: withIconOnly,
      })}
      {...props}
    >
      {!withIconOnly && svgIcon && iconPosition === ECircleButtonIconPosition.ICON_BEFORE && (
        <InlineIcon
          {...iconProps}
          className={cn(
            styles.circleButtonIcon,
            styles.circleButtonIconBefore,
            iconProps.className,
          )}
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
            className={cn(styles.circleButtonIcon, iconProps.className)}
            svgIcon={svgIcon}
          />
          &nbsp;
        </>
      ) : (
        children
      )}

      {!withIconOnly && svgIcon && iconPosition === ECircleButtonIconPosition.ICON_AFTER && (
        <InlineIcon
          {...iconProps}
          className={cn(styles.circleButtonIcon, styles.circleButtonIconAfter, iconProps.className)}
          svgIcon={svgIcon}
        />
      )}
    </ButtonBase>
  );
};

export { CircleButton, ECircleButtonLayout, ECircleButtonIconPosition };
