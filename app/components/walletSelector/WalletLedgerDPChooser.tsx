import { Field, FieldAttributes, FieldProps, Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { KycFormComponent } from "../Kyc";

interface IWalletLedgerDPChooserValues {
  derivationPath: string;
}

// You may see / user InjectedFormikProps<OtherProps, FormValues> instead of what comes below.
// They are the same--InjectedFormikProps was artifact of when Formik only exported an HOC. It is also less flexible as it
// MUST wrap all props (it passes them through).

export const DPChooserComponent = (props: FormikProps<IWalletLedgerDPChooserValues>) => (
  <div>Change your derivation path, if necessary.</div>
);

interface IWalletLedgerDPChooserProps {
  derivationPath: string;
  onChange: Function;
}

export const WalletLedgerDPChooser = withFormik<
  IWalletLedgerDPChooserProps,
  IWalletLedgerDPChooserValues
>({
  displayName: "derivation_path_form",
  // it turns out that this is needed so initial value is ""
  mapPropsToValues: props => {
    return {
      derivationPath: props.derivationPath,
    };
  },
  handleSubmit: values => {
    // tslint:disable-next-line
    console.log("values", values);
  },
  validationSchema: Yup.object().shape({
    derivationPath: Yup.string().required(),
  }),
})(DPChooserComponent);
