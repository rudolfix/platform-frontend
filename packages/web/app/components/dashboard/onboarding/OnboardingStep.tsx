import cn from "classnames";
import * as React from "react";

import { InlineIcon } from "../../shared/icons/InlineIcon";
import { EOnboardingStepState, TStepComponentProps } from "./types";

import checkMark from "../../../assets/img/inline_icons/icon_check.svg";
import * as styles from "./Onboarding.module.scss";

interface IStepTickerProps {
  stepState: EOnboardingStepState;
  number: number;
}

interface IExternalProps {
  isLast: boolean;
}

const StepTicker: React.FunctionComponent<IStepTickerProps> = ({ stepState, number }) => {
  switch (stepState) {
    case EOnboardingStepState.ACTIVE:
      return <div className={cn(styles.ticker, styles.active)}>{number}</div>;
    case EOnboardingStepState.DONE:
      return (
        <div className={cn(styles.ticker, styles.done)}>
          <InlineIcon svgIcon={checkMark} />
        </div>
      );
    case EOnboardingStepState.NOT_DONE:
    default:
      return <div className={styles.ticker}>{number}</div>;
  }
};

const OnboardingStep: React.FunctionComponent<TStepComponentProps & IExternalProps> = ({
  isLast,
  stepState,
  title,
  component,
  number,
}) => (
  <div className={styles.accountSetupStepWrapper}>
    <StepTicker stepState={stepState} number={number} />

    <div className={styles.title}>{title}</div>
    {!isLast && <span className={styles.line} />}

    {stepState === EOnboardingStepState.ACTIVE ? (
      <div className={styles.componentOpen}>{component}</div>
    ) : (
      <div className={cn(styles.componentClosed, { [styles.last]: isLast })} />
    )}
  </div>
);

export { OnboardingStep };
