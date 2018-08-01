import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import { kycRoutes } from "./routes";

import { SwitchConnected } from "../shared/connectedRouting";
import { KYCStart } from "./start/Start";

// private
import { TUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { invariant } from "../../utils/invariant";
import { ScrollToTop } from "../shared/ScrollToTop";
import { KYCBeneficialOwners } from "./business/BeneficialOwners";
import { KycBusinessData } from "./business/BusinessData";
import { KycLegalRepresentative } from "./business/LegalRepresentative";
import { KycBusinessStart } from "./business/Start";
import { KycPersonalInstantId } from "./personal/InstantId";
import { KYCPersonalStart } from "./personal/Start";
import { KYCPersonalUpload } from "./personal/Upload";

interface IStateProps {
  userType?: TUserType;
}

export const NormalKycRouter: React.SFC = () => (
  <SwitchConnected>
    <ScrollToTop>
      <Route path={kycRoutes.start} component={KYCStart} exact />

      {/* Personal */}
      <Route path={kycRoutes.individualStart} component={KYCPersonalStart} />
      <Route path={kycRoutes.individualInstantId} component={KycPersonalInstantId} />
      <Route path={kycRoutes.individualUpload} component={KYCPersonalUpload} />

      {/* Business */}
      <Route path={kycRoutes.businessStart} component={KycBusinessStart} />
      <Route path={kycRoutes.legalRepresentative} component={KycLegalRepresentative} />
      <Route path={kycRoutes.businessData} component={KycBusinessData} />
      <Route path={kycRoutes.beneficialOwners} component={KYCBeneficialOwners} />

      <Redirect to={kycRoutes.start} />
    </ScrollToTop>
  </SwitchConnected>
);

export const EtoKycRouter: React.SFC = () => (
  <SwitchConnected>
    <Route path={kycRoutes.start} component={KycBusinessStart} exact />

    {/* Business Only*/}
    <Route path={kycRoutes.businessStart} component={KycBusinessStart} />
    <Route path={kycRoutes.legalRepresentative} component={KycLegalRepresentative} />
    <Route path={kycRoutes.businessData} component={KycBusinessData} />
    <Route path={kycRoutes.beneficialOwners} component={KYCBeneficialOwners} />

    <Redirect to={kycRoutes.businessStart} />
  </SwitchConnected>
);

export const KycRouterComponent: React.SFC<IStateProps> = ({ userType }) => {
  switch (userType) {
    case "investor":
      return <NormalKycRouter />;
    case "issuer":
      return <EtoKycRouter />;
    default:
      return invariant(false, "Unknown user type");
  }
};

export const KycRouter = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    userType: selectUserType(s.auth),
  }),
})(KycRouterComponent);
