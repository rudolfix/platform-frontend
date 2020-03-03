import { Button, ButtonGroup, EButtonLayout, EButtonSize } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { EKycRequestType } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { withProgress } from "../../../utils/react-connected-components/withProgress";
import { KYCAddDocuments } from "../shared/AddDocuments";

import * as styles from "../personal/Start.module.scss";

interface IDispatchProps {
  goBack: () => void;
}

export const KYCAdditionalUploadLayout: React.FunctionComponent<IDispatchProps> = props => (
  <>
    <KYCAddDocuments uploadType={EKycRequestType.BUSINESS} />

    <ButtonGroup className={styles.buttons}>
      <Button
        layout={EButtonLayout.OUTLINE}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-personal-start-go-back"
        onClick={props.goBack}
      >
        <FormattedMessage id="form.back" />
      </Button>
    </ButtonGroup>
  </>
);

export const KYCAdditionalUpload = compose<IDispatchProps, {}>(
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCSuccess()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadBusinessDocumentList()),
  }),
  withProgress(() => ({ step: 5, allSteps: 5 })),
)(KYCAdditionalUploadLayout);
