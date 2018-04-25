import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import {
  BOOL_FALSE_KEY,
  BOOL_TRUE_KEY,
  boolify,
  FormField,
  FormSelectCountryField,
  FormSelectField,
  NONE_KEY,
  unboolify,
} from "../../shared/forms/forms";

import {
  IKycIndividualData,
  KycIndividudalDataSchemaRequired,
} from "../../../lib/api/KycApi.interfaces";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { FormFieldDate } from "../../shared/forms/formField/FormFieldDate";
import { Tooltip } from "../../shared/Tooltip";
import { KycPanel } from "../KycPanel";

const PEP_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};

const US_CITIZEN_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};

const HIGH_INCOME_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no" />,
};

interface IStateProps {
  currentValues?: IKycIndividualData;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
}

type IProps = IStateProps & IDispatchProps & FormikProps<IKycIndividualData>;

const KYCForm = injectIntlHelpers<IProps & IKycIndividualData>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <Form>
      <FormField label={formatIntlMessage("form.label.first-name")} name="firstName" />
      <FormField label={formatIntlMessage("form.label.last-name")} name="lastName" />
      <FormFieldDate label={formatIntlMessage("form.label.birth-date")} name="birthDate" />

      <FormField label={formatIntlMessage("form.label.street-and-number")} name="street" />
      <Row>
        <Col xs={12} md={6} lg={8}>
          <FormField label={formatIntlMessage("form.label.city")} name="city" />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <FormField label={formatIntlMessage("form.label.zip-code")} name="zipCode" />
        </Col>
      </Row>
      <FormSelectCountryField label={formatIntlMessage("form.label.country")} name="country" />
      <br />
      <FormSelectField
        values={PEP_VALUES}
        label={
          <>
            <FormattedMessage id={"kyc.personal.politically-exposed.question"} />
            <Tooltip
              className="ml-2"
              text={formatIntlMessage("kyc.personal.politically-exposed.tooltip")}
            />
          </>
        }
        name="isPoliticallyExposed"
      />
      <FormSelectField
        values={US_CITIZEN_VALUES}
        label="Are you a US citizen?"
        name="isUsCitizen"
      />
      <FormSelectField
        values={HIGH_INCOME_VALUES}
        label={formatIntlMessage("kyc.personal.high-income")}
        name="isHighIncome"
      />
      <div className="p-4 text-center">
        <Button type="submit" disabled={!props.isValid || props.loadingData}>
          <FormattedMessage id={"form.save-and-submit"} />
        </Button>
      </div>
    </Form>
  ),
);

const KYCEnhancedForm = withFormik<IProps, IKycIndividualData>({
  validationSchema: KycIndividudalDataSchemaRequired,
  isInitialValid: (props: any) => KycIndividudalDataSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => unboolify(props.currentValues as IKycIndividualData),
  enableReinitialize: true,
  handleSubmit: (values, props) => {
    props.props.submitForm(boolify(values));
  },
})(KYCForm);

export const KYCPersonalStartComponent = injectIntlHelpers<IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => {
    return (
      <KycPanel
        steps={5}
        currentStep={2}
        title={formatIntlMessage("kyc.personal.title")}
        hasBackButton={true}
      >
        <div className="pb-4">
          <h6>
            <FormattedMessage id={"kyc.personal.personal-information.question"} />
          </h6>
          <FormattedMessage id={"kyc.personal.personal-information.answer"} />
        </div>
        <KYCEnhancedForm {...props} />
      </KycPanel>
    );
  },
);

export const KYCPersonalStart = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: state.kyc.individualData,
      loadingData: !!state.kyc.individualDataLoading,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitIndividualData(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
)(KYCPersonalStartComponent);
