import * as React from "react";
import { branch, renderNothing, withProps } from "recompose";
import { compose } from "redux";

import { selectIsInvestor, selectIsVerifiedInvestor } from "../../../../../modules/auth/selectors";
import { selectMyPledge } from "../../../../../modules/bookbuilding-flow/selectors";
import { appConnect } from "../../../../../store";
import { CampaigningActivatedInvestorApprovedWidget } from "./CampaigningActivatedInvestorApprovedWidget";
import { CampaigningActivatedUnapprovedInvestorWidget } from "./CampaigningActivatedUnapprovedInvestorWidget";

import { IPledge } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces";

export interface IExternalProps {
  investorsCount: number | null;
  etoId: string;
  investorsLimit: number;
  minPledge: number;
  maxPledge?: number;
}

interface IStateProps {
  isVerifiedInvestor: boolean;
  isInvestor: boolean;
  pledge?: IPledge;
}

interface IWithProps {
  showInvestorWidget: boolean;
}

type IProps = IExternalProps & IStateProps & IWithProps;

const CampaigningActivatedInvestorWidgetLayout: React.SFC<IProps> = ({
  isVerifiedInvestor,
  etoId,
  minPledge,
  maxPledge,
}) =>
  isVerifiedInvestor ? (
    <CampaigningActivatedInvestorApprovedWidget
      minPledge={minPledge}
      maxPledge={maxPledge}
      etoId={etoId}
    />
  ) : (
    <CampaigningActivatedUnapprovedInvestorWidget minPledge={minPledge} maxPledge={maxPledge} />
  );

const CampaigningActivatedInvestorWidget = compose<React.SFC<IExternalProps>>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      return {
        isInvestor: selectIsInvestor(state),
        pledge: selectMyPledge(props.etoId, state),
        isVerifiedInvestor: selectIsVerifiedInvestor(state),
      };
    },
  }),
  withProps<IWithProps, IStateProps & IExternalProps>(
    ({ pledge, isInvestor, investorsLimit, investorsCount }) => ({
      showInvestorWidget:
        isInvestor && (investorsCount === null || investorsCount < investorsLimit || !!pledge),
    }),
  ),
  branch<IWithProps>(props => !props.showInvestorWidget, renderNothing),
)(CampaigningActivatedInvestorWidgetLayout);

export { CampaigningActivatedInvestorWidget };
