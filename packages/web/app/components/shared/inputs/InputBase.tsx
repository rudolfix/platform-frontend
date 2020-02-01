import * as cn from "classnames";
import * as React from "react";

import styles from "./InputBase.module.scss";

/**
 * A base building block for all kind of input elements. Contains basic style reset.
 */
const InputBase = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, type = "text", ...rest }, ref) => (
  <input type={type} ref={ref} className={cn(styles.inputBase, className)} {...rest} />
));

export { InputBase };
