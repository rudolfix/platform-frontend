import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { withHeaderButton } from "../../../../utils/react-connected-components/withHeaderButton";
import { withProgress } from "../../../../utils/react-connected-components/withProgress";

type TRecoveryStepProps = {
  step: number;
  allSteps: number;
  buttonAction: () => void;
};

export const RecoveryStepBase: React.FunctionComponent<TRecoveryStepProps> = ({ children }) => (
  <>{children}</>
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
