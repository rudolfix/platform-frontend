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
    <>
      {/* TODO: Change tooltip to use bootstrap which supports injecting html elements */}
      <span className={cn(className, styles.tooltip)} data-tooltip={text}>
        <InlineIcon svgIcon={icon} />
      </span>
      <p className={styles.mobileText}>{text}</p>
    </>
  );
};
