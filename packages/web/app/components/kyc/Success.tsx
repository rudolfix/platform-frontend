import { Button, ButtonGroup, EButtonLayout, EButtonSize } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType } from "../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectKycRequestType } from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { withHeaderButton } from "../../utils/react-connected-components/withHeaderButton";
import { withProgress } from "../../utils/react-connected-components/withProgress";
import { SuccessTick } from "../shared/SuccessTick";

import * as styles from "./Success.module.scss";

interface IStateProps {
  requestType?: EKycRequestType;
}

interface IDispatchProps {
  goToDashboard: () => void;
  goToPersonalAddAdditional: () => void;
  goToBusinessAddAdditional: () => void;
}

const KycSuccessLayout: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  goToDashboard,
  goToPersonalAddAdditional,
  goToBusinessAddAdditional,
  requestType,
}) => (
  <>
    <SuccessTick />
    <h1 className={styles.title} data-test-id="kyc-success">
      <FormattedMessage id="kyc.success.title" />
    </h1>
    <p className={styles.text}>
      {requestType === EKycRequestType.INDIVIDUAL ? (
        <FormattedMessage id="kyc.personal.success.text" />
      ) : (
        <FormattedMessage id="kyc.business.success.text" />
      )}
    </p>

    <ButtonGroup className={styles.buttons} data-test-id="kyc-success">
      <Button
        layout={EButtonLayout.PRIMARY}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-success-go-to-dashboard"
        onClick={goToDashboard}
      >
        <FormattedMessage id="kyc.success.go-to-dashboard" />
      </Button>
      <Button
        layout={EButtonLayout.LINK}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-success-go-to-additional-documents"
        onClick={
          requestType === EKycRequestType.INDIVIDUAL
            ? goToPersonalAddAdditional
            : goToBusinessAddAdditional
        }
      >
        <FormattedMessage id="kyc.success.go-to-additional-documents" />
      </Button>
    </ButtonGroup>
  </>
);

const KycSuccess = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      requestType: selectKycRequestType(state),
    }),
    dispatchToProps: dispatch => ({
      goToPersonalAddAdditional: () => dispatch(actions.routing.goToKYCIndividualUpload()),
      goToBusinessAddAdditional: () => dispatch(actions.routing.goToKYCBusinessUpload()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  withProgress(() => ({ step: 5, allSteps: 5 })),
  withHeaderButton(() => ({
    buttonText: undefined,
    buttonAction: undefined,
  })),
)(KycSuccessLayout);

export { KycSuccessLayout, KycSuccess };
