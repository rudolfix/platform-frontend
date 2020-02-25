import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../../types";
import { InputBase } from "./InputBase";

import styles from "./TextInput.module.scss";

const TextInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof InputBase> & TDataTestId
>(({ children, className, ...props }, ref) => (
  <InputBase ref={ref} className={cn(styles.textInput, className)} {...props} />
));

export { TextInput };
