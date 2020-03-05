import * as React from "react";

import { RecoveryStep } from "./RecoveryStep";
import { LightWalletSeedRecoveryComponent } from "./SeedRecovery.unsafe";

type TLightWalletRecoverySeedCheckProps = {
  goToDashboard: () => void;
  onValidSeed: (words: string) => void;
};

export const LightWalletRecoverySeedCheck: React.FunctionComponent<TLightWalletRecoverySeedCheckProps> = ({
  goToDashboard,
  onValidSeed,
}) => (
  <RecoveryStep
    step={1}
    allSteps={2}
    buttonAction={goToDashboard}
    data-test-id="recover-layout"
  >
    <LightWalletSeedRecoveryComponent onValidSeed={onValidSeed} />
  </RecoveryStep>

);


