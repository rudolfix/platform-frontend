import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button } from "../../shared/Buttons";
import { KycPanel } from "../KycPanel";
import { Panels, PanelTheme } from "../shared/Panels";

interface IProps {
  goToPerson: () => void;
  goToCompany: () => void;
}

export const KYCStartComponent = injectIntlHelpers<IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <KycPanel
      steps={4}
      currentStep={1}
      title={formatIntlMessage("kyc.start.title")}
      isMaxWidth={true}
    >
      <Panels
        panels={[
          {
            content: (
              <Button theme="t-white" onClick={props.goToPerson}>
                <FormattedMessage id="kyc.start.go-to-personal" />
              </Button>
            ),
            theme: PanelTheme.black,
            id: 1,
          },
          {
            content: (
              <Button theme="t-white" onClick={props.goToCompany}>
                <FormattedMessage id="kyc.start.go-to-company" />
              </Button>
            ),
            theme: PanelTheme.blue,
            id: 2,
          },
        ]}
      />
    </KycPanel>
  ),
);

export const KYCStart = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      goToPerson: () => dispatch(actions.routing.goToKYCIndividualStart()),
      goToCompany: () => dispatch(actions.routing.goToKYCBusinessStart()),
    }),
  }),
)(KYCStartComponent);
