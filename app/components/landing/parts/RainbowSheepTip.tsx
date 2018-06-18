import * as cn from "classnames";
import * as React from "react";

import { ScrollSpy } from "./ScrollSpy";

import * as sheep from "../../../assets/img/landing/rainbowsheep.gif";
import * as styles from "./RainbowSheepTip.module.scss";

interface IProps {
  side: "left" | "right";
  triggerY: number;
}

const TRIGGER_DELTA = 100;

export const RainbowSheepTip: React.SFC<IProps> = ({ side, triggerY }) => (
  <ScrollSpy condition={y => y > triggerY - TRIGGER_DELTA && y < triggerY + TRIGGER_DELTA}>
    {visible => (
      <div className={cn(styles.sheepWrapper, !visible && styles.hidden, styles[side])}>
        <img src={sheep} />
      </div>
    )}
  </ScrollSpy>
);
