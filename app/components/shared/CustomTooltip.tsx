import * as cn from "classnames";
import * as React from "react";
import { Tooltip, TooltipProps } from 'reactstrap'

import { CommonHtmlProps } from "../../types";

import * as icon from "../../assets/img/inline_icons/icon_questionmark.svg";
import * as styles from "./Tooltip.module.scss";

interface IProps {
  targetNode: React.ReactNode
}

export class CustomTooltip extends React.Component<Partial<TooltipProps> & IProps> {
  state = {
    tooltipOpen: false
  }

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  targetRef = React.createRef<HTMLSpanElement>()

  render (): React.ReactChild {
    const { target, className, isOpen, toggle, children, targetNode, ...props } = this.props
    return (
      <>
        <Tooltip target={this.targetRef.current as any} isOpen={isOpen || this.state.tooltipOpen} toggle={toggle || this.toggle} {...props}>
          {children}
        </Tooltip>
      </>
    );
  }
}
