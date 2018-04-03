/**
 * https://app.zeplin.io/project/5a8a92c89c1a166a6a6e8f37/screen/5a9ec65230c36a8054f42bb0
 * Pretty straightforward. We need a text area field here but that's all really.
 * Person lists can be reused from other components
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
  EtoMarketInformationSchemaRequired,
  IEtoMarketInformation,
} from "../../../lib/api/EtoApi.interfaces";

interface IStateProps {
  currentValues: IEtoMarketInformation;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoMarketInformation) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoMarketInformation> & IProps) => (
  <Form>
    <FormField label="Sales Model" name="salesModel" />
    {/** add business partners here, list of IEtoBusinessPartners, for now you could omit the social channels, the design needs to change here **/}
    {/** add key customers section here, list of IEtoKeyCustomer, for now omit the social channels **/}
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        Submit and continue
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoMarketInformation>({
  validationSchema: EtoMarketInformationSchemaRequired,
  isInitialValid: (props: any) =>
    EtoMarketInformationSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationMarketInformationComponent: React.SFC<IProps> = props => (
  <EtoRegistrationPanel
    steps={6}
    currentStep={4}
    title={"Market Information"}
    hasBackButton={false}
    isMaxWidth={true}
  >
    <EtoEnhancedForm {...props} />
  </EtoRegistrationPanel>
);

export const EtoRegistrationMarketInformation = compose<React.SFC>(
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
)(EtoRegistrationMarketInformationComponent);
