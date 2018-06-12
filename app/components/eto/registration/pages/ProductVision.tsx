import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoCompanyInformationType, TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";

interface IStateProps {
  loadingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  submitForm: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (_props: FormikProps<TPartialEtoData>) => {
  return (
    <Form>
      <h1>Product vision</h1>
    </Form>
  );
};

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  validationSchema: EtoCompanyInformationType.toYup(),
  // isInitialValid: (props: IStateProps) => formikValidator(EtoTeamDataType)(props.stateValues),
  mapPropsToValues: props => props.stateValues,
  // enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationTeamAndInvestorsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationProductVision = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      stateValues: s.etoFlow.companyData,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (data: any) => {
        dispatch(actions.etoFlow.loadData({ companyData: data }));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationTeamAndInvestorsComponent);
