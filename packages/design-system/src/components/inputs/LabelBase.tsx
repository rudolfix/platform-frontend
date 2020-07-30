import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./LabelBase.module.scss";

type TLabelBaseProps = {
  isOptional?: boolean;
};

const LabelBase = React.forwardRef<
  HTMLLabelElement,
  React.DetailedHTMLProps<
    // TODO: Check why is the css property in `LabelHTMLAttributes` problematic
    // This is a TEMP Fix that omits css as it is causing issues while running yarn `tsc:e2e` in `packages/web`
    Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "css">,
    HTMLLabelElement
  > &
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
