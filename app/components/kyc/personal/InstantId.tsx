import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";
import { compose } from "redux";

import { TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { KycPanel } from "../KycPanel";
import { kycRoutes } from "../routes";

import * as idImage from "../../../assets/img/id_now.svg";
import * as arrowRightIcon from "../../../assets/img/inline_icons/arrow_right.svg";
import * as linkOutIcon from "../../../assets/img/inline_icons/link_out_small.svg";
import * as styles from "./InstantId.module.scss";

interface IStateProps {}

interface IDispatchProps {
  onStartInstantId: () => void;
  onManualVerification: () => void;
}

interface IProps {
  layout: TKycRequestType;
}

export const KycPersonalInstantIdComponent: React.SFC<IProps & IStateProps & IDispatchProps> = ({
  ...props
}) => (
  <KycPanel
    steps={3}
    currentStep={3}
    title={<FormattedMessage id="kyc.personal.instant-id.title" />}
    description={<FormattedHTMLMessage tagName="span" id="kyc.personal.instant-id.description" />}
    backLink={kycRoutes.individualStart}
  >
    <img className={styles.image} src={idImage} alt="id now" />
    <div className="mb-5 text-center">
      <Button onClick={props.onStartInstantId} svgIcon={linkOutIcon} iconPosition="icon-after">
        <FormattedMessage id="kyc.personal.instant-id.go-to-video-verification" />
      </Button>
    </div>
    <p className="text-center">
      <FormattedHTMLMessage
        tagName="span"
        id="kyc.personal.instant-id.manual-verification-description"
      />
    </p>
    <div className="text-center">
      <Button
        layout="secondary"
        onClick={props.onManualVerification}
        svgIcon={arrowRightIcon}
        iconPosition="icon-after"
      >
        <FormattedMessage id="kyc.personal.instant-id.go-to-manual-verification" />
      </Button>
    </div>
  </KycPanel>
);

export const KycPersonalInstantId = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: dispatch => ({
      onStartInstantId: () => dispatch(actions.kyc.kycStartInstantId()),
      onManualVerification: () => dispatch(actions.routing.goToKYCIndividualUpload()),
    }),
  }),
)(KycPersonalInstantIdComponent);
