import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { TDataTestId, TTranslatedString } from "../../../../types";
import { withHeaderButton } from "../../../../utils/react-connected-components/withHeaderButton";
import { withProgress } from "../../../../utils/react-connected-components/withProgress";

import * as styles from "../../../kyc/shared/KycStep.module.scss";

type TRecoveryStepProps = {
  step: number;
  allSteps: number;
  title: TTranslatedString;
  description: TTranslatedString;
  buttonAction: () => void;
};

export const RecoveryStepBase: React.FunctionComponent<TRecoveryStepProps & TDataTestId> = ({
  step,
  allSteps,
  title,
  description,
  ["data-test-id"]: dataTestId,
}) => (
  <>
    <span className={styles.step} data-test-id={dataTestId}>
      <FormattedMessage id="shared.step" values={{ step, allSteps }} />
    </span>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
  </>
);

export const RecoveryStep = compose<TRecoveryStepProps, TRecoveryStepProps>(
  withProgress<TRecoveryStepProps>((props: TRecoveryStepProps) => ({
    step: props.step,
    allSteps: props.allSteps,
  })),
  withHeaderButton<TRecoveryStepProps>((props: TRecoveryStepProps) => ({
    buttonText: <FormattedMessage id="account-recovery.step.cancel" />,
    buttonAction: props.buttonAction,
  })),
)(RecoveryStepBase);
