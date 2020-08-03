import cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";

import * as styles from "./FormError.module.scss";

interface IFormErrorExternalProps {
  name?: string;
  message: TTranslatedString;
  alignLeft?: boolean;
}

const generateErrorId = (name: string) => `${name}-error-message`;

const FormError: React.FunctionComponent<IFormErrorExternalProps & CommonHtmlProps> = ({
  message,
  name,
  className,
  alignLeft,
}) => (
  <div
    data-test-id={name && `form.${name}.error-message`}
    id={name && generateErrorId(name)}
    role="alert"
    className={cn(styles.errorLabel, { [styles.errorLabelAlignLeft]: alignLeft }, className)}
  >
    {message}
  </div>
);

export { FormError, generateErrorId };
