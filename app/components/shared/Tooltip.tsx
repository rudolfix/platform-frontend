import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import { InlineIcon } from "./InlineIcon";

import * as icon from "../../assets/img/inline_icons/icon_questionmark.svg";
import * as styles from "./Tooltip.module.scss";

interface IProps {
  text: string;
  className?: string;
}

export const Tooltip: React.SFC<IProps & CommonHtmlProps> = ({ text, className }) => {
  return (
    <div className={styles.tooltipWrapper}>
      <span className={cn(className, styles.tooltip)} data-tooltip={text}>
        <InlineIcon svgIcon={icon} />
      </span>
      <p className={styles.tooltipText}>{text}</p>
    </div>
  );
};
