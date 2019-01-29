import * as cn from "classnames";
import * as React from "react";

import { SpinningEthereum } from "./SpinningEthereum";

import { CommonHtmlProps } from "../../../types";
import * as styles from "./ConfettiEthereum.module.scss";

export const ConfettiEthereum: React.FunctionComponent<CommonHtmlProps> = ({
  className,
  style,
}) => {
  return (
    <div className={cn([styles.wrapper, className])} style={style}>
      <SpinningEthereum />
      <div className={cn(styles.cannon)}>
        <div className={cn(styles.path, styles.pathSm, styles.pathAngleM2)}>
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor3)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor1)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor2)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor1)} />
          <div className={cn(styles.confettiSpacer)} />
        </div>
        <div className={cn(styles.path, styles.pathMd, styles.pathAngleM1)}>
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor2)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor2)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor3)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor1)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor4)} />
          <div className={cn(styles.confettiSpacer)} />
        </div>
        <div className={cn(styles.path, styles.pathLg, styles.pathAngle0)}>
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor1)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor4)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor2)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor3)} />
          <div className={cn(styles.confettiSpacer)} />
        </div>
        <div className={cn(styles.path, styles.pathMd, styles.pathAngle1)}>
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor3)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor1)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor4)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor3)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor2)} />
          <div className={cn(styles.confettiSpacer)} />
        </div>
        <div className={cn(styles.path, styles.pathSm, styles.pathAngle2)}>
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor2)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor3)} />
          <div className={cn(styles.confetti, styles.confettiFlake, styles.confettiColor4)} />
          <div className={cn(styles.confetti, styles.confettiRibbon, styles.confettiColor1)} />
          <div className={cn(styles.confettiSpacer)} />
        </div>
      </div>
    </div>
  );
};
