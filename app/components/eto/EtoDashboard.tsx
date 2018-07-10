import * as React from "react";
import { Row } from "reactstrap";

import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { selectBackupCodesVerified, selectVerifiedUserEmail } from "../../modules/auth/selectors";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/SettingsWidgets";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { DashboardSection } from "./shared/DashboardSection";

interface IStateProps {
  isLightWallet: boolean;
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  requestStatus?: TRequestStatus;
}

type IProps = IStateProps;

export const EtoDashboardComponent: React.SFC<IProps> = props => {
  const { verifiedEmail, backupCodesVerified, requestStatus } = props;
  const isVerificationSectionDone = !!(
    verifiedEmail &&
    backupCodesVerified &&
    requestStatus === "Accepted"
  );
  return (
    <LayoutAuthorized>
      <Row className="row-gutter-top">
        {!isVerificationSectionDone && (
          <>
            <DashboardSection
              step={1}
              title="VERIFICATION"
              data-test-id="eto-dashboard-verification"
            />
            <SettingsWidgets isDynamic={true} {...props} />
          </>
        )}
        <DashboardSection
          step={2}
          title="ETO APPLICATION"
          data-test-id="eto-dashboard-application"
        />
        <ETOFormsProgressSection />
      </Row>
    </LayoutAuthorized>
  );
};

export const EtoDashboard = appConnect<IStateProps>({
  stateToProps: s => ({
    isLightWallet: selectIsLightWallet(s.web3),
    verifiedEmail: selectVerifiedUserEmail(s.auth),
    backupCodesVerified: selectBackupCodesVerified(s.auth),
    requestStatus: selectKycRequestStatus(s.kyc),
  }),
})(EtoDashboardComponent);
