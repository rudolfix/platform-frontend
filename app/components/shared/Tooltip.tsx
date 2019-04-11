import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, OmitKeys, TTranslatedString } from "../../types";
import { CustomTooltip } from "./CustomTooltip";
import { InlineIcon } from "./icons";

import * as icon from "../../assets/img/inline_icons/icon_questionmark.svg";
import * as styles from "./Tooltip.module.scss";

interface IProps {
  content: TTranslatedString;
  isOpen?: boolean;
}

type TForwardedProps = OmitKeys<React.ComponentProps<typeof CustomTooltip>, "isOpen" | "target">;

let tooltipCount = 0;

class Tooltip extends React.Component<
  IProps & CommonHtmlProps & TForwardedProps,
  { targetId: string }
> {
  state = {
    targetId: `tooltip-${tooltipCount++}`,
  };

  render(): React.ReactNode {
    let { content, className, isOpen, children, ...tooltipProps } = this.props;
    return (
      <span
        className={cn(
          className,
          styles.tooltipWrapper,
          children ? styles.tooltipWrapperText : styles.tooltipWrapperIcon,
        )}
        onClick={e => e.preventDefault()}
      >
        <span
          key={this.state.targetId} // add specific key to recreate dom, when tooltipId changed dynamically
          className={styles.tooltip}
          id={this.state.targetId}
        >
          {children ? children : <InlineIcon svgIcon={icon} />}
        </span>
        <CustomTooltip
          key={`${this.state.targetId}-container`} // add specific key to recreate dom, when tooltipId changed dynamically
          isOpen={isOpen}
          target={this.state.targetId}
          {...tooltipProps}
        >
          {content}
        </CustomTooltip>
      </span>
    );
  }
}

export { Tooltip };
