import * as React from "react";
import { compose } from "redux";

import { selectIsVerifiedInvestor } from "../../../../../modules/auth/selectors";
import { appConnect } from "../../../../../store";
import { CampaigningActivatedInvestorApprovedWidget } from "./CampaigningActivatedInvestorApprovedWidget";
import { CampaigningActivatedUnapprovedInvestorWidget } from "./CampaigningActivatedUnapprovedInvestorWidget";

import { IPledge } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces";

export interface IExternalProps {
  etoId: string;
  minPledge: number;
  maxPledge?: number;
  pledge?: IPledge;
}

interface IStateProps {
  isVerifiedInvestor: boolean;
}

type IProps = IExternalProps & IStateProps;

const CampaigningActivatedInvestorWidgetLayout: React.SFC<IProps> = ({
  isVerifiedInvestor,
  etoId,
  minPledge,
  maxPledge,
  pledge,
}) =>
  isVerifiedInvestor ? (
    <CampaigningActivatedInvestorApprovedWidget
      minPledge={minPledge}
      maxPledge={maxPledge}
      etoId={etoId}
      pledge={pledge}
    />
  ) : (
    <CampaigningActivatedUnapprovedInvestorWidget minPledge={minPledge} maxPledge={maxPledge} />
  );

const CampaigningActivatedInvestorWidget = compose<React.SFC<IExternalProps>>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: state => {
      return {
        isVerifiedInvestor: selectIsVerifiedInvestor(state),
      };
    },
  }),
)(CampaigningActivatedInvestorWidgetLayout);

export { CampaigningActivatedInvestorWidget };
