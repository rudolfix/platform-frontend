import * as cn from "classnames";
import * as React from "react";

import { ScrollSpy } from "./ScrollSpy";

import * as sheep from "../../../assets/img/landing/rainbowsheep.gif";
import * as thoughts from "../../../assets/img/landing/thoughts.svg";
import * as styles from "./RainbowSheepTip.module.scss";

interface IProps {
  side: "left" | "right";
  triggerY: number;
  tip: string[];
}

interface IState {
  open: boolean;
  tipIndex: number;
}

const TRIGGER_DELTA = 100;
const TIP_TIMEOUT = 5000;
const DEFAULT_MESSAGE = "Never stop bouncing :)";

export class RainbowSheepTip extends React.Component<IProps> {
  state: IState = {
    open: false,
    tipIndex: -1,
  };

  timerTask: any;

  onClick = () => {
    this.setState({
      open: true,
      tipIndex: this.state.tipIndex + 1,
    });

    if (this.timerTask) {
      clearTimeout(this.timerTask);
    }
    this.timerTask = setTimeout(() => this.setState({ ...this.state, open: false }), TIP_TIMEOUT);
  };

  render(): React.ReactNode {
    const { side, triggerY, tip } = this.props;
    const { open, tipIndex } = this.state;

    return (
      <ScrollSpy condition={y => y > triggerY - TRIGGER_DELTA && y < triggerY + TRIGGER_DELTA}>
        {visible => (
          <div
            className={cn(styles.sheepWrapper, !visible && styles.hidden, styles[side])}
            onClick={this.onClick}
          >
            {open && (
              <div className={styles.thoughts}>
                <img src={thoughts} />
                <span className={styles.thoughtsText}>{tip[tipIndex] || DEFAULT_MESSAGE}</span>
              </div>
            )}
            <img src={sheep} />
          </div>
        )}
      </ScrollSpy>
    );
  }
}
