import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { KycPanel } from "../KycPanel";
import { Panels } from "../shared/Panels";

export const personalSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.personal-details" />,
    isChecked: false,
  },
  {
    label: <FormattedMessage id="kyc.steps.documents-verification" />,
    isChecked: false,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: false,
  },
];

interface IProps {
  goToPerson: () => void;
  goToCompany: () => void;
}

export const KYCStartComponent = injectIntlHelpers<IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <KycPanel steps={personalSteps} title={formatIntlMessage("kyc.start.title")} isMaxWidth={true}>
      <Panels
        panels={[
          {
            content: <FormattedMessage id="kyc.start.go-to-personal" />,
            id: 1,
            onClick: () => props.goToPerson(),
            tid: "kyc-start-go-to-personal"
          },
          {
            content: <FormattedMessage id="kyc.start.go-to-company" />,
            id: 2,
            onClick: () => props.goToCompany(),
            tid: "kyc-start-go-to-company"
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
