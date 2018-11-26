import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../types";
import { CustomTooltip } from "./CustomTooltip";
import { InlineIcon } from "./InlineIcon";

import * as icon from "../../assets/img/inline_icons/icon_questionmark.svg";
import * as styles from "./Tooltip.module.scss";

interface IProps {
  content: TTranslatedString;
  isOpen?: boolean;
}

let tooltipCount = 0;

export const Tooltip: React.SFC<IProps & CommonHtmlProps> = ({ content, className, isOpen }) => {
  const tooltipId = `tooltip-${tooltipCount++}`;
  return (
    <div className={cn(className, styles.tooltipWrapper)} onClick={e => e.preventDefault()}>
      <span className={styles.tooltip} id={tooltipId}>
        <InlineIcon svgIcon={icon} />
      </span>
      <CustomTooltip isOpen={isOpen} target={tooltipId}>
        {content}
      </CustomTooltip>
    </div>
  );
};
