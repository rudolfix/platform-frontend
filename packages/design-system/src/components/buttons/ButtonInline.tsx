import * as cn from "classnames";
import * as React from "react";

import { ButtonBase } from "./ButtonBase";

import * as styles from "./ButtonInline.module.scss";

/**
 * An inline version of button used to replaced `a` tags in case we want to have `onClick` handler over `href`
 */
type TButtonLayout = {
  isActive?: boolean;
};

const ButtonInline = React.forwardRef<
  HTMLButtonElement,
  TButtonLayout & React.ComponentProps<typeof ButtonBase>
>(({ className, isActive, ...rest }, ref) => (
  <ButtonBase
    ref={ref}
    className={cn(
      styles.buttonInline,
      {
        [styles.buttonIsActive]: isActive,
      },
      className,
    )}
    {...rest}
  />
));

export { ButtonInline };
