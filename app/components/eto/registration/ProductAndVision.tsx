/**
 * https://app.zeplin.io/project/5a8a92c89c1a166a6a6e8f37/screen/5a9ec6527abe10c916f73da4
 * very straight forward :)
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
  EtoProductAndVisionSchemaRequired,
  IEtoProductAndVision,
} from "../../../lib/api/EtoApi.interfaces";

interface IStateProps {
  currentValues: IEtoProductAndVision;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoProductAndVision) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoProductAndVision> & IProps) => (
  <Form>
    <FormField label="First name" name="firstName" />
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        Submit and continue
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoProductAndVision>({
  validationSchema: EtoProductAndVisionSchemaRequired,
  isInitialValid: (props: any) =>
    EtoProductAndVisionSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationProductAndVisionComponent: React.SFC<IProps> = props => (
  <EtoRegistrationPanel
    steps={6}
    currentStep={5}
    title={"Product and Vision"}
    hasBackButton={false}
    isMaxWidth={true}
  >
    <EtoEnhancedForm {...props} />
  </EtoRegistrationPanel>
);

export const EtoRegistrationProductAndVision = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: _state => ({
      loadingData: false,
      currentValues: {},
    }),
    dispatchToProps: _dispatch => ({
      submitForm: () => {},
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationProductAndVisionComponent);
