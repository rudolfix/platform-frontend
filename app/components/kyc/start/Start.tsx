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
    label: "representation",
    isChecked: true,
  },
  {
    label: "personal details",
    isChecked: false,
  },
  {
    label: "documents verification",
    isChecked: false,
  },
  {
    label: "review",
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
          },
          {
            content: <FormattedMessage id="kyc.start.go-to-company" />,
            id: 2,
            onClick: () => props.goToCompany(),
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
