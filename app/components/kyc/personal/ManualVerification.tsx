import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { Form, Formik, FormikProps } from "formik";
import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";
import { ButtonPrimary } from "../../shared/Buttons";
import { FormField } from "../../shared/forms/forms";

import * as Yup from "yup";

interface IProps {
  submitForm: () => void;
  currentValues: IFormValues;
}

interface IFormValues {
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

const STREET = "street";
const POSTAL_CODE = "postalCode";
const CITY = "city";
const COUNTRY = "country";

const validationSchema = Yup.object().shape({
  [STREET]: Yup.string()
    .required("Your street is required")
    .min(3, "Must be longer than 3"),
  [POSTAL_CODE]: Yup.string()
    .required("Your postal code is required")
    .min(3, "Must be longer than 3"),
  [CITY]: Yup.string()
    .required("Your city is required")
    .min(3, "Must be longer than 3"),
  [COUNTRY]: Yup.string()
    .required("Your country is required")
    .min(3, "Must be longer than 3"),
});

const KYCForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField label="Street" touched={formikBag.touched} errors={formikBag.errors} name={STREET} />
    <FormField
      label="Postal Code"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={POSTAL_CODE}
    />
    <FormField label="City" touched={formikBag.touched} errors={formikBag.errors} name={CITY} />
    <FormField
      label="Country"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={COUNTRY}
    />
    <br />
    <br />
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
    validationSchema={validationSchema}
  />
);

export const KYCPersonalManualVerificationComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={5} currentStep={3} />
    <br />
    <h1>Manual Verification</h1>
    <br />
    <KYCEnhancedForm {...props} />
  </div>
);

export const KYCPersonalManualVerification = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) =>
        dispatch(actions.kyc.kycSubmitManualVerificationForm(values)),
    }),
  }),
)(KYCPersonalManualVerificationComponent);
