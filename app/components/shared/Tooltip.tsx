import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import { InlineIcon } from "./InlineIcon";

import * as icon from "../../assets/img/inline_icons/icon_questionmark.svg";
import * as styles from "./Tooltip.module.scss";

interface IProps {
  content: string | React.ReactNode;
  className?: string;
}

export const Tooltip: React.SFC<IProps & CommonHtmlProps> = ({ content, className }) => {
  return (
    <div className={cn(className, styles.tooltipWrapper)}>
      <span className={styles.tooltip}>
        <InlineIcon svgIcon={icon} />
      </span>
      <p className={styles.tooltipText}>{content}</p>
    </div>
  );
};
