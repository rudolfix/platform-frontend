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
  alignLeft?: boolean;
  targetId?: string;
}

let tooltipCount = 0;

export const Tooltip: React.SFC<IProps & CommonHtmlProps> = ({
  content,
  className,
  isOpen,
  alignLeft,
  targetId,
}) => {
  const tooltipId = targetId || `tooltip-${tooltipCount++}`;
  return (
    <span className={cn(className, styles.tooltipWrapper)} onClick={e => e.preventDefault()}>
      <span
        key={tooltipId} // add specific key to recreate dom, when tooltipId changed dynamically
        className={styles.tooltip}
        id={tooltipId}
      >
        <InlineIcon svgIcon={icon} />
      </span>
      <CustomTooltip
        key={`${tooltipId}-container`} // add specific key to recreate dom, when tooltipId changed dynamically
        isOpen={isOpen}
        target={tooltipId}
        className={cn(alignLeft && styles.alignLeft)}
      >
        {content}
      </CustomTooltip>
    </span>
  );
};
