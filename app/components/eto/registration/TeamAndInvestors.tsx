/**
 * https://app.zeplin.io/project/5a8a92c89c1a166a6a6e8f37/screen/5a9ec65230c36a8054f42c65
 *
 * Number of founders does not make sense. We will have multiple founders in here similar
 * to the beneficial owners
 *
 *
 * Probably we need a single file upload field. Maybe you can create one which we then can
 * use in other components
 * Re-use the social channels component from company information here
 *
 * Captable, Notable investors and advisors should be set up similar to the beneifical owners
 * with a "Add captable entry" button instead of adding multiple entries at once. Please
 * user the correct interface definiions from EtoApi.interfaces.ts. For deleting you can add the
 * wastebin from the file upload next to the entry
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
  EtoTeamInformationSchemaRequired,
  IEtoTeamInformation,
} from "../../../lib/api/EtoApi.interfaces";

interface IStateProps {
  currentValues: IEtoTeamInformation;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoTeamInformation) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoTeamInformation> & IProps) => (
  <Form>
    <FormField label="First name" name="firstName" />
    {/** add founnders section here, lis of IEtoFounder **/}
    {/** add captable section here, list of IEtoCaptableEntry, for now you could omit the social channels, the design needs to change here **/}
    {/** add noable investors section here, list of IEtoNotableInvestor, for now omit the social channels **/}
    {/** add advisors section here, list of IEtoAdvisor, omit the social channels  **/}
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        Submit and continue
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoTeamInformation>({
  validationSchema: EtoTeamInformationSchemaRequired,
  isInitialValid: (props: any) => EtoTeamInformationSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationTeamAndInvestorsComponent: React.SFC<IProps> = props => (
  <EtoRegistrationPanel
    steps={6}
    currentStep={3}
    title={"Team and Investors"}
    hasBackButton={false}
    isMaxWidth={true}
  >
    <EtoEnhancedForm {...props} />
  </EtoRegistrationPanel>
);

export const EtoRegistrationTeamAndInvestors = compose<React.SFC>(
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
)(EtoRegistrationTeamAndInvestorsComponent);
