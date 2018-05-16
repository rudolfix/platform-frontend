import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { KycRouter } from "./Router";

import { TKycRequestType, TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectKycOutSourcedURL,
  selectKycRequestStatus,
  selectPendingKycRequestType,
} from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { Button } from "../shared/Buttons";
import { KycPanel } from "./KycPanel";
import { KYCAddDocuments } from "./shared/AddDocuments";

import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";
import { injectIntlHelpers } from "../../utils/injectIntlHelpers";

export const personalSteps = [
  {
    label: "representation",
    isChecked: true,
  },
  {
    label: "personal details",
    isChecked: true,
  },
  {
    label: "documents verification",
    isChecked: true,
  },
  {
    label: "review",
    isChecked: true,
  },
];

interface IStateProps {
  requestLoading?: boolean;
  requestStatus?: TRequestStatus;
  redirectUrl: string;
  pendingRequestType: TKycRequestType | undefined;
}

interface IDispatchProps {
  reopenRequest: () => void;
  goToWallet: () => void;
}

type IProps = IStateProps & IDispatchProps;

const RequestStateInfo = injectIntlHelpers<IProps>(({ intl: { formatIntlMessage }, ...props }) => {
  const settingsButton = (
    <div className="p-4 text-center">
      <Button
        layout="secondary"
        iconPosition="icon-before"
        svgIcon={arrowLeft}
        onClick={props.goToWallet}
      >
        <FormattedMessage id="kyc.request-state.go-to-wallet" />
      </Button>
    </div>
  );
  if (!props.requestStatus) {
    return (
      <KycPanel
        steps={personalSteps}
        description={formatIntlMessage("kyc.request-state.description")}
      >
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Pending") {
    return (
      <KycPanel
        title={formatIntlMessage("kyc.request-state.pending.title")}
        steps={personalSteps}
        description={formatIntlMessage("kyc.request-state.pending.description")}
      >
        {props.pendingRequestType && <KYCAddDocuments uploadType={props.pendingRequestType} />}
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Accepted") {
    return (
      <KycPanel
        title={formatIntlMessage("kyc.request-state.accepted.title")}
        steps={personalSteps}
        description={formatIntlMessage("kyc.request-state.accepted.description")}
      >
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Rejected") {
    return (
      <KycPanel
        title={formatIntlMessage("kyc.request-state.rejected.title")}
        steps={personalSteps}
        description={formatIntlMessage("kyc.request-state.rejected.description")}
      >
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Outsourced") {
    return (
      <KycPanel
        title={formatIntlMessage("kyc.request-state.outsourced.title")}
        steps={personalSteps}
        description={formatIntlMessage("kyc.request-state.outsourced.description")}
      >
        {" "}
        <div className="p-4 text-center">
          <a href={props.redirectUrl}>
            <FormattedMessage id="kyc.request-state.click-here-to-continue" />
          </a>
        </div>
      </KycPanel>
    );
  }
  return <div />;
});

export const KycComponent: React.SFC<IProps> = props => {
  const router = props.requestStatus === "Draft" ? <KycRouter /> : <div />;

  return (
    <LayoutAuthorized>
      <Row>
        <Col xs={12} lg={{ size: 8, offset: 2 }}>
          <RequestStateInfo {...props} />
          {router}
        </Col>
      </Row>
    </LayoutAuthorized>
  );
};

export const Kyc = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      requestLoading:
        state.kyc.individualRequestStateLoading || state.kyc.businessRequestStateLoading,
      requestStatus: selectKycRequestStatus(state.kyc),
      redirectUrl: selectKycOutSourcedURL(state.kyc),
      pendingRequestType: selectPendingKycRequestType(state.kyc),
    }),
    dispatchToProps: dispatch => ({
      reopenRequest: () => {},
      goToWallet: () => dispatch(actions.routing.goToWallet()),
    }),
    options: { pure: false },
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadIndividualRequest());
      dispatch(actions.kyc.kycLoadBusinessRequest());
    },
  }),
)(KycComponent);
