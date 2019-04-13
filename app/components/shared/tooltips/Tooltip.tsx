import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, OmitKeys, TTranslatedString } from "../../../types";
import { InlineIcon } from "../icons";
import { TooltipBase } from "./TooltipBase";

import * as icon from "../../../assets/img/inline_icons/icon_questionmark.svg";
import * as styles from "./Tooltip.module.scss";

interface IProps {
  content: TTranslatedString;
  isOpen?: boolean;
  preventDefault?: boolean;
}

type TForwardedProps = OmitKeys<React.ComponentProps<typeof TooltipBase>, "target">;

let tooltipCount = 0;

class Tooltip extends React.Component<
  IProps & CommonHtmlProps & TForwardedProps,
  { targetId: string }
> {
  static defaultProps = {
    preventDefault: true,
  };

  state = {
    targetId: `tooltip-${tooltipCount++}`,
  };

  render(): React.ReactNode {
    const { content, className, children, preventDefault, ...tooltipProps } = this.props;
    return (
      <span
        className={cn(
          className,
          styles.tooltipWrapper,
          children ? styles.tooltipWrapperText : styles.tooltipWrapperIcon,
        )}
        onClick={preventDefault ? e => e.preventDefault() : undefined}
      >
        <span className={styles.tooltip} id={this.state.targetId}>
          {children ? children : <InlineIcon svgIcon={icon} />}
        </span>
        <TooltipBase target={this.state.targetId} {...tooltipProps}>
          {content}
        </TooltipBase>
      </span>
    );
  }
}

export { Tooltip };
