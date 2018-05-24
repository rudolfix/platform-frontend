import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { TKycBusinessType } from "../../../lib/api/KycApi.interfaces";
import { KycPanel } from "../KycPanel";
import { kycRoutes } from "../routes";
import { Panels } from "../shared/Panels";

export const businessSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.company-details" />,
    isChecked: false,
  },
  {
    label: <FormattedMessage id="kyc.steps.legal-representation" />,
    isChecked: false,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: false,
  },
];

interface IStateProps {
  loading: boolean;
}

interface IDispatchProps {
  setBusinessType: (type: TKycBusinessType) => void;
}

type IProps = IStateProps & IDispatchProps;

export const KycBusinessStartComponent: React.SFC<IProps> = props => (
  <KycPanel steps={businessSteps} backLink={kycRoutes.start} isMaxWidth={true}>
    <Panels
      panels={[
        {
          content: <FormattedMessage id="kyc.business.start.type.small" />,
          id: 1,
          onClick: () => props.setBusinessType("small"),
          "data-test-id": "kyc-start-business-go-to-small",
        },
        {
          content: <FormattedMessage id="kyc.business.start.type.corporation" />,
          id: 2,
          onClick: () => props.setBusinessType("corporate"),
          "data-test-id": "kyc-start-business-go-to-corporation",
        },
        {
          content: <FormattedMessage id="kyc.business.start.type.partnership" />,
          id: 3,
          onClick: () => props.setBusinessType("partnership"),
          "data-test-id": "kyc-start-business-go-to-partnership",
        },
      ]}
    />
  </KycPanel>
);

export const KycBusinessStart = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      loading: !!state.kyc.businessDataLoading,
    }),
    dispatchToProps: dispatch => ({
      setBusinessType: (type: TKycBusinessType) => dispatch(actions.kyc.kycSetBusinessType(type)),
    }),
  }),
)(KycBusinessStartComponent);
