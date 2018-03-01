import * as React from "react";

import { Form, Formik, FormikProps } from "formik";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { ButtonPrimary } from "../../shared/Buttons";
import { FormField } from "../../shared/forms/forms";

import * as Yup from "yup";

const FIRST_NAME = "firstName";
const SECOND_NAME = "secondName";
const BIRTH_DATE = "birthDate";
const PLACE_OF_BIRTH = "placeOfBirth";

interface IFormValues {
  firstName?: string;
  secondName?: string;
  birthDate?: string;
  placeOfBirth?: string;
}

interface IProps {
  submitForm: (values: IFormValues) => void;
  currentValues: IFormValues;
}

const validate = () => {};

const validationSchema = Yup.object().shape({
  [FIRST_NAME]: Yup.string()
    .required("Your first name is required")
    .min(3, "Must be longer than 3"),
  [SECOND_NAME]: Yup.string()
    .required("Your second name is required")
    .min(3, "Must be longer than 3"),
  [BIRTH_DATE]: Yup.string()
    .typeError("Please add your birth date in the form dd.mm.yyyy")
    .required("Please add your birth date"),
  [PLACE_OF_BIRTH]: Yup.string()
    .required("Your place of birth is required")
    .min(3, "Must be longer than 3"),
});

const KYCForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField
      label="First Name"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={FIRST_NAME}
    />
    <FormField
      label="Second Name"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={SECOND_NAME}
    />
    <FormField
      label="Birth Date"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={BIRTH_DATE}
      placeholder="e.g. 26.09.1982"
    />
    <FormField
      label="Place of Birth"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={PLACE_OF_BIRTH}
    />
    <ButtonPrimary type="submit" disabled={!formikBag.isValid}>
      Submit
    </ButtonPrimary>
  </Form>
);

const KYCEnhancedForm = (props: IProps) => (
  <Formik
    initialValues={props.currentValues}
    onSubmit={props.submitForm}
    render={KYCForm}
    validate={validate}
    validationSchema={validationSchema}
  />
);

export const KYCPersonalStartComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={4} currentStep={2} />
    <br />
    <h1>Personal Details</h1>
    <br />
    <KYCEnhancedForm {...props} />
  </div>
);

export const KYCPersonalStart = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => dispatch(actions.kyc.kycSubmitPersonalForm(values)),
    }),
  }),
)(KYCPersonalStartComponent);
