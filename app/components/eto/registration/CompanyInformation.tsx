/**
 * https://app.zeplin.io/project/5a8a92c89c1a166a6a6e8f37/screen/5a9ec6548d47ba9d1552d820
 * Maybe you can try to add a formfield for tags which produces an array and a formfield
 * for the list of social channels, which basically is an array of strings (see IEtoCompanyInformation)
 */

import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import { FormField } from "../../shared/forms/forms";

import {
  EtoCompanyInformationSchemaRequired,
  IEtoCompanyInformation,
} from "../../../lib/api/EtoApi.interfaces";

interface IStateProps {
  currentValues: IEtoCompanyInformation;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoCompanyInformation) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoCompanyInformation> & IProps) => (
  <Form>
    <FormField label="Company Name" name="name" />
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        Submit and continue
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoCompanyInformation>({
  validationSchema: EtoCompanyInformationSchemaRequired,
  isInitialValid: (props: any) =>
    EtoCompanyInformationSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationCompanyInformationComponent: React.SFC<IProps> = props => (
  <EtoRegistrationPanel
    steps={6}
    currentStep={1}
    title={"Company Information"}
    hasBackButton={false}
    isMaxWidth={true}
  >
    <EtoEnhancedForm {...props} />
  </EtoRegistrationPanel>
);

export const EtoRegistrationCompanyInformation = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: _state => ({
      loadingData: false,
      currentValues: {},
    }),
    dispatchToProps: _dispatch => ({
      submitForm: (_values: IEtoCompanyInformation) => {},
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationCompanyInformationComponent);
