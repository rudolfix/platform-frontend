import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { RecoveryStep } from "./RecoveryStep";
import { RestoreLightWallet } from "../../light/Register/RestoreLightWallet";

export interface IRecoveryFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

type TLightWalletRecoverySignUpProps = {
  goToDashboard: () => void;
  seed: string;
};

export const LightWalletRecoverySignUp: React.FunctionComponent<TLightWalletRecoverySignUpProps> = ({
  goToDashboard,
  seed,
}) => (
  <>
    <RecoveryStep
      step={2}
      allSteps={2}
      title={<FormattedMessage id="account-recovery.seed-check.title" />}
      description={<FormattedMessage id="account-recovery.sign-up.description" />}
      buttonAction={goToDashboard}
      data-test-id="recover-layout"
    />
    <RestoreLightWallet seed={seed}/>
  </>
);
