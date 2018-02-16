import * as React from "react";

import { Form, Formik, FormikProps } from "formik";
import { Button } from "reactstrap";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/progressStepper/ProgressStepper";

import { actions } from "../../../modules/actions";

import { FormField } from "../../shared/forms/forms";

import * as Yup from "yup";

const COMPANY_NAME = "companyName";
const PLACE_OF_INCORPORATION = "placeOfIncorporation";
const MANAGING_DIRECTOR = "managingDirector";

const STREET = "street";
const POSTAL_CODE = "postalCode";
const CITY = "city";
const COUNTRY = "country";

interface IFormValues {
  companyName?: string;
  placeOfIncorporation?: string;
  managingDirector?: string;

  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

interface IProps {
  submitForm: (values: IFormValues) => void;
  currentValues: IFormValues;
}

const validate = () => {};

const validationSchema = Yup.object().shape({
  [COMPANY_NAME]: Yup.string()
    .required("Your company name is required")
    .min(3, "Must be longer than 3"),
  [PLACE_OF_INCORPORATION]: Yup.string()
    .required("Your place of incorporation is required")
    .min(3, "Must be longer than 3"),
  [MANAGING_DIRECTOR]: Yup.string()
    .required("The name of your managing director is required")
    .min(3, "Must be longer than 3"),

  [STREET]: Yup.string()
    .required("Company street is required")
    .min(3, "Must be longer than 3"),
  [POSTAL_CODE]: Yup.string()
    .required("Company postal code is required")
    .min(3, "Must be longer than 3"),
  [CITY]: Yup.string()
    .required("Company city is required")
    .min(3, "Must be longer than 3"),
  [COUNTRY]: Yup.string()
    .required("Company country is required")
    .min(3, "Must be longer than 3"),
});

const KYCForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField
      label="Company Name"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={COMPANY_NAME}
    />
    <FormField
      label="Place of incorporation"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={PLACE_OF_INCORPORATION}
    />
    <FormField
      label="Managing Director"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={MANAGING_DIRECTOR}
    />
    <br /> <br />
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
    <Button color="primary" type="submit" disabled={!formikBag.isValid}>
      Submit
    </Button>
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

export const KYCCompanyStartComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={3} currentStep={2} />
    <br />
    <h1>Company Details</h1>
    <br />
    <KYCEnhancedForm {...props} />
  </div>
);

export const KYCCompanyStart = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => dispatch(actions.kycSubmitCompanyForm(values)),
    }),
  }),
)(KYCCompanyStartComponent);
