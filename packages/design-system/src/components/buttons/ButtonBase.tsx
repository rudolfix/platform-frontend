import cn from "classnames";
import * as React from "react";

import * as styles from "./ButtonBase.module.scss";

/**
 * A base building block for all kind of buttons. Contains some styles reset and some default :focus-visible implementation
 */
const ButtonBase = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    // TODO: Check why is the css property in `ButtonHTMLAttributes` problematic
    // This is a TEMP Fix that omits css as it is causing issues while running yarn `tsc:e2e` in `packages/web`
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "css">,
    HTMLButtonElement
  >
>(({ className, type = "button", ...rest }, ref) => (
  <button type={type} ref={ref} className={cn(styles.buttonBase, className)} {...rest} />
));

export { ButtonBase };
