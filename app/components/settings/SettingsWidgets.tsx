import * as React from "react";
import { Col } from "reactstrap";

import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { BackupSeedWidget } from "./backupSeed/BackupSeedWidget";
import { KycStatusWidget } from "./kycStates/KycStatusWidget";
import { VerifyEmailWidget } from "./verifyEmail/VerifyEmailWidget";

interface IProps {
  isLightWallet: boolean;
}

export const SettingsWidgetsComponent: React.SFC<IProps> = ({ isLightWallet }) => {
  let settingsStepCounter = 0;
  return (
    <>
      <Col lg={4} xs={12}>
        <VerifyEmailWidget step={++settingsStepCounter} />
      </Col>
      {isLightWallet && (
        <Col lg={4} xs={12}>
          <BackupSeedWidget step={++settingsStepCounter} />
        </Col>
      )}
      <Col lg={4} xs={12}>
        <KycStatusWidget step={++settingsStepCounter} />
      </Col>;
    </>
  );
};

export const SettingsWidgets = appConnect<IProps, {}>({
  stateToProps: s => ({
    isLightWallet: selectIsLightWallet(s.web3),
  }),
})(SettingsWidgetsComponent);
