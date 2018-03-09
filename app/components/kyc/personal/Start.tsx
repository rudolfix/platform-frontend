import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

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

import { IKycIndividualData, KycIndividudalDataSchema } from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonPrimary } from "../../shared/Buttons";

const PEP_VALUES = {
  [NONE_KEY]: "-please select-",
  [BOOL_TRUE_KEY]: "Yes I am",
  [BOOL_FALSE_KEY]: "No I am not",
};

const US_CITIZEN_VALUES = {
  [NONE_KEY]: "-please select-",
  [BOOL_TRUE_KEY]: "Yes I am",
  [BOOL_FALSE_KEY]: "No I am not",
};

const HIGH_INCOME_VALUES = {
  [NONE_KEY]: "-please select-",
  [BOOL_TRUE_KEY]: "Yes I have",
  [BOOL_FALSE_KEY]: "No I have not",
};

interface IStateProps {
  currentValues?: IKycIndividualData;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = (formikBag: FormikProps<IKycIndividualData> & IProps) => (
  <Form>
    <FormField label="First Name" name="firstName" />
    <FormField label="Last Name" name="lastName" />
    <FormField label="Birth Date" name="birthDate" />

    <FormField label="Street and number" name="street" />
    <FormField label="Zip Code" name="zipCode" />
    <FormField label="City" name="city" />
    <FormSelectCountryField label="Country" name="country" />
    <br />
    <FormSelectField
      values={PEP_VALUES}
      label="Are you politically exposed?"
      name="isPoliticallyExposed"
    />
    <FormSelectField values={US_CITIZEN_VALUES} label="Are you a US citizen?" name="isUsCitizen" />
    <FormSelectField
      values={HIGH_INCOME_VALUES}
      label="Do you have a high income??"
      name="isHighIncome"
    />

    <br />
    <br />
    <br />
    <ButtonPrimary
      color="primary"
      type="submit"
      disabled={!formikBag.isValid || formikBag.loadingData}
    >
      Submit and continue
    </ButtonPrimary>
  </Form>
);

const KYCEnhancedForm = withFormik<IProps, IKycIndividualData>({
  validationSchema: KycIndividudalDataSchema,
  isInitialValid: (props: any) => KycIndividudalDataSchema.isValidSync(props.currentValues),
  mapPropsToValues: props => unboolify(props.currentValues as IKycIndividualData),
  enableReinitialize: true,
  handleSubmit: (values, props) => {
    props.props.submitForm(boolify(values));
  },
})(KYCForm);

export const KYCPersonalStartComponent: React.SFC<IProps> = props => {
  return (
    <div>
      <br />
      <ProgressStepper steps={4} currentStep={2} />
      <br />
      <h1>Personal Details</h1>
      <br />
      <KYCEnhancedForm {...props} />
    </div>
  );
};

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
