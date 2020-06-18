import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../types";
import { InlineIcon } from "./icons/InlineIcon";

import warningIcon from "../../assets/img/inline_icons/warning-circle--solid.svg";
import * as styles from "./WarningAlert.module.scss";

export enum EWarningAlertSize {
  NORMAL,
  BIG = styles.big,
}

interface IWarningAlertProps {
  className?: string;
  size?: EWarningAlertSize;
}

export const WarningAlert: React.FunctionComponent<IWarningAlertProps & TDataTestId> = ({
  children,
  className,
  size = EWarningAlertSize.NORMAL,
  "data-test-id": dataTestId,
}) => (
  <div className={cn(styles.warningAlert, size, className)} data-test-id={dataTestId}>
    <InlineIcon svgIcon={warningIcon} className={styles.icon} />
    <span>{children}</span>
  </div>
);
