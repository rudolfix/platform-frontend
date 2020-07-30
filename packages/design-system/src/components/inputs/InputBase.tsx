import cn from "classnames";
import * as React from "react";

import * as styles from "./InputBase.module.scss";

/**
 * A base building block for all kind of input elements. Contains basic style reset.
 */
const InputBase = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    // TODO: Check why is the css property in `InputHTMLAttributes` problematic
    // This is a TEMP Fix that omits css as it is causing issues while running yarn `tsc:e2e` in `packages/web`
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "css">,
    HTMLInputElement
  >
>(({ className, type = "text", ...rest }, ref) => (
  <input type={type} ref={ref} className={cn(styles.inputBase, className)} {...rest} />
));

export { InputBase };
