import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
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

export const personalSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.personal-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.documents-verification" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: true,
  },
];

export const businessSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.company-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.legal-representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
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

class RequestStateInfo extends React.Component<IProps> {
  componentDidUpdate (): void {

  }

  render (): React.ReactNode {
    const steps = this.props.pendingRequestType === "business" ? businessSteps : personalSteps;
    const settingsButton = (
      <div className="p-4 text-center">
        <Button
          layout="secondary"
          iconPosition="icon-before"
          svgIcon={arrowLeft}
          onClick={this.props.goToWallet}
        >
          <FormattedMessage id="kyc.request-state.go-to-wallet" />
        </Button>
      </div>
    );
    if (!this.props.requestStatus) {
      return (
      <KycPanel steps={steps} description={<FormattedMessage id="kyc.request-state.description" />}>
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === "Pending") {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.pending.title" />}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.pending.description" />}
        >
          {this.props.pendingRequestType && <KYCAddDocuments uploadType={this.props.pendingRequestType} />}
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === "Accepted") {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.accepted.title"/>}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.accepted.description"/>}
        >
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === "Rejected") {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.rejected.title"/>}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.rejected.description"/>}
        >
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === "Outsourced") {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.outsourced.title"/>}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.outsourced.description"}
        >
          {" "}
          <div className="p-4 text-center">
            <a href={this.props.redirectUrl}>
              <FormattedMessage id="kyc.request-state.click-here-to-continue" />
            </a>
          </div>
        </KycPanel>
      );
    }
    return <div />;
  }
}

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
