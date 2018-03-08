import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { FormField, FormSelectCountryField } from "../../shared/forms/forms";

import { IKycIndividualData, KycIndividudalDataSchema } from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonPrimary } from "../../shared/Buttons";

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
    <br />
    <div>TODO add checkboxes, please ask dave :)</div>
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
  mapPropsToValues: props => props.currentValues as IKycIndividualData,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
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
