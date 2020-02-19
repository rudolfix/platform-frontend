import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import styles from "./LabelBase.module.scss";

type TLabelBaseProps = {
  isOptional?: boolean;
};

const LabelBase = React.forwardRef<
  HTMLLabelElement,
  React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> &
    TLabelBaseProps
>(({ className, isOptional, ...rest }, ref) => (
  <>
    <label ref={ref} className={cn(styles.label, className)} {...rest} />
    {isOptional && (
      <span className={styles.optionalField}>
        (<FormattedMessage id="form.label.optional" />)
      </span>
    )}
  </>
));

export { LabelBase };
