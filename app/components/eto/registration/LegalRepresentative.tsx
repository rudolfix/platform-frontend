/**
 * https://app.zeplin.io/project/5a8a92c89c1a166a6a6e8f37/screen/5a9ec65430c36a8054f42d93
 * You can make this pretty much the same as the corresponding kyc page with the benefical owners etc
 * Booleans should always be dropdowns like in kyc, not like in the design
 * I think the monthly income button on this page is not needed, though, please ignore it.
 * We can also re-use the upload field from kyc here, please refactor it into a general component
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
  EtoLegalRepresentativeSchemaRequired,
  IEtoLegalRepresentative,
} from "../../../lib/api/EtoApi.interfaces";

interface IStateProps {
  currentValues: IEtoLegalRepresentative;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoLegalRepresentative) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoLegalRepresentative> & IProps) => (
  <Form>
    <FormField label="First name" name="firstName" />
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        Submit and continue
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoLegalRepresentative>({
  validationSchema: EtoLegalRepresentativeSchemaRequired,
  isInitialValid: (props: any) =>
    EtoLegalRepresentativeSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationLegalRepresentativeComponent: React.SFC<IProps> = props => (
  <EtoRegistrationPanel
    steps={6}
    currentStep={2}
    title={"Legal Representative"}
    hasBackButton={false}
    isMaxWidth={true}
  >
    <EtoEnhancedForm {...props} />
  </EtoRegistrationPanel>
);

export const EtoRegistrationLegalRepresentative = compose<React.SFC>(
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
)(EtoRegistrationLegalRepresentativeComponent);
