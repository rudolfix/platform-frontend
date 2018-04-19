import * as React from "react";

import * as cn from "classnames";
import { range } from "lodash";
import * as checkIcon from "../../../assets/img/inline_icons/check.svg";
import { InlineIcon } from "../../shared/InlineIcon";
import * as styles from "./EtoProgressStepper.module.scss";

export interface IStepProps {
  name: string;
  isDone: boolean;
}
export interface IEtoProgressStepper {
  currentStep: number;
  stepProps: IStepProps[];
  onClick: (step: number) => void;
}

export const EtoProgressStepper: React.SFC<IEtoProgressStepper> = ({
  currentStep,
  stepProps,
  onClick,
}) => (
  <div className={styles.progressStepper}>
    {range(stepProps.length).map(number => (
      <div key={number} className="text-center" data-test-id="EtoProgressStepper-header-text">
        {stepProps[number].isDone ? (
          <InlineIcon
            svgIcon={checkIcon}
            height="11px"
            width="15px"
            className=""
            data-test-id="check-icon"
          />
        ) : (
          `${number + 1}. ${stepProps[number].name}`
        )}
        <div
          className={cn(styles.step, number + 1 === currentStep && styles.active)}
          onClick={() => onClick(number)}
          data-test-id="EtoProgressStepper-step-button"
        />
      </div>
    ))}
  </div>
);
