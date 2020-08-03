import { TDataTestId } from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";

import { InputBase } from "./InputBase";

import * as styles from "./Input.module.scss";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof InputBase> & TDataTestId
>(({ children, className, ...props }, ref) => (
  <InputBase ref={ref} className={cn(styles.textInput, className)} {...props} />
));

export { Input };
