import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../types";
import { InlineIcon } from "./icons/InlineIcon";

import warningIcon from "../../assets/img/inline_icons/warning-circle--solid.svg";
import * as styles from "./WarningAlert.module.scss";

interface IWarningAlertProps {
  className?: string;
}

export const WarningAlert: React.FunctionComponent<IWarningAlertProps & TDataTestId> = ({
  children,
  className,
  "data-test-id": dataTestId,
}) => (
  <div className={cn(styles.warningAlert, className)}>
    <span data-test-id={dataTestId}>
      <InlineIcon svgIcon={warningIcon} className={styles.icon} />
      {children}
    </span>
  </div>
);
