import * as React from "react";
import * as styles from "./InstantId.module.scss";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";

import { Button } from "../../shared/Buttons";
import { KycPanel } from "../KycPanel";
import { TUploadListLayout } from "../shared/KycFileUploadList";

import * as idImage from "../../../assets/img/ID_now.svg";
import * as arrowRightIcon from "../../../assets/img/inline_icons/arrow_right.svg";
import * as linkOutIcon from "../../../assets/img/inline_icons/link_out_small.svg";

interface IStateProps {}

interface IDispatchProps {
  onStartInstantId: () => void;
  onContinue: () => void;
}

interface IProps {
  layout: TUploadListLayout;
}

export const KycPersonalInstantIdComponent: React.SFC<
  IProps & IStateProps & IDispatchProps
> = props => (
  <KycPanel
    steps={5}
    currentStep={4}
    title={"Start Instant Verification"}
    description={
      "You will be redirected to our verification partner IDNow in order to complete a fast video verification via your desktop or mobile camera. After the successfull verification, you can mmediately invest and deposit funds on the NEUFUND platform."
    }
    hasBackButton={true}
  >
    <img className={styles.image} src={idImage} alt="id now" />
    <div className="mb-5 text-center">
      <Button onClick={props.onStartInstantId} svgIcon={linkOutIcon} iconPosition="icon-after">Go to video verification</Button>
    </div>
    <p className="text-center">Optionally, fill out the form and upload your documents.<br/>This verfcation method will a take 24h processing time.</p>
    <div className="text-center">
      <Button
        layout="secondary"
        onClick={props.onContinue}
        svgIcon={arrowRightIcon}
        iconPosition="icon-after">
        Manual veryfication
      </Button>
    </div>
  </KycPanel>
);

export const KycPersonalInstantId = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: dispatch => ({
      onStartInstantId: () => dispatch(actions.kyc.kycStartInstantId()),
      onContinue: () => dispatch(actions.routing.goToKYCIndividualUpload()),
    }),
  }),
)(KycPersonalInstantIdComponent);
