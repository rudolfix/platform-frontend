import * as cn from "classnames";
import * as React from "react";
import { Tooltip, TooltipProps } from "reactstrap";

import * as styles from "./CustomTooltip.module.scss";

export enum ECustomTooltipTextPosition {
  CENTER = styles.tooltipTextCenter,
  LEFT = styles.tooltipTextLeft,
}

interface IProps {
  textPosition?: ECustomTooltipTextPosition;
}

interface IState {
  tooltipOpen: boolean;
}

export class CustomTooltip extends React.Component<IProps & TooltipProps> {
  static defaultProps = {
    textPosition: ECustomTooltipTextPosition.CENTER,
  };

  state: IState = {
    tooltipOpen: false,
  };

  toggle = () => {
    if (!this.props.isOpen) {
      this.setState((s: IState) => ({ tooltipOpen: !s.tooltipOpen }));
    }
  };

  componentDidMount(): void {
    if (this.props.isOpen) {
      this.setState({
        tooltipOpen: true,
      });
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // this function should not be called, but just in case
    // if some errors occurs, it will not crash the whole application any more
    // prevents a reactstrap tooltip bug where target dom node is not found

    // tslint:disable-next-line:no-console
    console.error(error, info);
    // trigger a rerender to update current dom
    // this prevents errors where the id in the target dom node has changed dynamically
    this.setState({ tooltipOpen: this.state.tooltipOpen });
  }

  render(): React.ReactChild {
    const { target, className, textPosition, isOpen, toggle, children, ...props } = this.props;
    return (
      <Tooltip
        innerClassName={styles.tooltipInner}
        className={cn(styles.tooltip, textPosition, className)}
        target={target}
        autohide={false}
        isOpen={this.state.tooltipOpen}
        toggle={toggle || this.toggle}
        {...props}
      >
        {children}
      </Tooltip>
    );
  }
}
