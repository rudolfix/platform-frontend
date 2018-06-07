import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoTeamDataType, TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";
import { Button } from "../../../shared/Buttons";
import { FormFieldDate } from "../../../shared/forms/formField/FormFieldDate";
import { FormField } from "../../../shared/forms/forms";
import { EtoTagWidget, generateTagOptions } from "../../shared/EtoTagWidget";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  submitForm: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (props: FormikProps<TPartialEtoData>) => {
  return (
    <Form>
      <h4 className="text-center">Legal Information</h4>
      <Section>
        {/* TODO: Remove Title and add it to header component */}
        <FormField label="Legal company name" name="companyName" />
        <FormField label="Legal form" name="legalForm" />
        <FormField label="Company Street Address" name="companyAddress" />
        <FormField label="City / Country" name="companyCountry" />
        <FormField label="Registration number*" name="registrationNumber" />
        <FormField label="Vat number*" name="vatNumber" />
        <FormFieldDate label="Company founding date*" name="foundingDate" />
        <FormField label="Number of employees*" name="employeeNumber" />
        <FormField label="Number of founders" name="foundersNumber" />
        <FormField label="Last Funding Amount*" name="lastFund" />
        <FormField label="Number of existing shares" name="existingShareNumber" />

        {/* TODO: Add pie chart */}
      </Section>
      <Col>
        <Row className="justify-content-end">
          <Button
            layout="primary"
            className="mr-4"
            onClick={() => {
              // tslint:disable-next-line
              console.log("Form values: ", props.values);
              props.submitForm();
            }}
          >
            Save
          </Button>
        </Row>
      </Col>
    </Form>
  );
};

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  validationSchema: EtoTeamDataType.toYup(),
  // isInitialValid: (props: IStateProps) => formikValidator(EtoTeamDataType)(props.stateValues),
  mapPropsToValues: props => props.stateValues,
  // enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationLegalInformationComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationLegalInformation = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      stateValues: s.etoFlow.data,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (data: any) => {
        dispatch(actions.etoFlow.loadData(data));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationLegalInformationComponent);
