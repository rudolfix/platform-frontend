import * as React from "react";

import { RecoveryStep } from "../RecoveryStep";
import { RestoreLightWallet } from "./RestoreLightWallet";

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
  <RecoveryStep step={2} allSteps={2} buttonAction={goToDashboard} data-test-id="recover-layout">
    <RestoreLightWallet seed={seed} />
  </RecoveryStep>
);
