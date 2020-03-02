import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { RegisterWithLightWalletComponent } from "../../light/Register/RegisterLightWallet";
import { RecoveryStep } from "./RecoveryStep";

export interface IRecoveryFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

type TLightWalletRecoverySignUpProps = {
  goToDashboard: () => void;
  submitForm: (values: IRecoveryFormValues, seed: string) => void;
  seed: string;
};

export const LightWalletRecoverySignUp: React.FunctionComponent<TLightWalletRecoverySignUpProps> = ({
  goToDashboard,
  submitForm,
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
    <RegisterWithLightWalletComponent
      restore={true}
      submitForm={(values: IRecoveryFormValues) => {
        submitForm(values, seed);
      }}
    />
  </>
);
