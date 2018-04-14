import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { appConnect } from "../../../store";

import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import { FormField } from "../../shared/forms/forms";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";
import {
  EtoTeamInformationSchemaRequired,
  IEtoTeamInformation,
} from "../../../lib/api/EtoApi.interfaces";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { FormTextArea } from "../../shared/forms/formField/FormTextArea";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { SingleFileUpload } from "../../shared/SingleFileUpload";

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
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>Founders</h4>
        <Accordion>
          <AccordionElement isOpened={true} title="First Name">
            <FormField label="First name" name="firstName" />
            <FormField label="Surname" name="surName" />
            <SingleFileUpload
              className="my-5"
              onDropFile={() => {}}
              files={[]}
              fileUploading={false}
              filesLoading={false}
              uploadCta="Add founder photo"
              fileFormatInformation=".jpg, .png"
            />
            <FormTextArea label="Short bio" name="shortBio" />
          </AccordionElement>
        </Accordion>
        <div className="p-4 text-center">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={plusIcon}
            onClick={() => {}}
            disabled={true}
          >
            Add new Owner
          </Button>
        </div>
      </Col>
    </Row>

    <HorizontalLine className="mb-4" />

    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>Captable</h4>
        <Accordion>
          <AccordionElement isOpened={true} title="First Name">
            <FormField label="First name" name="firstName" />
            <FormField label="Surname" name="surname" />
            <FormField label="Percent" placeholder="%" name="percent" />
          </AccordionElement>
        </Accordion>
        <div className="p-4 text-center">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={plusIcon}
            onClick={() => {}}
            disabled={true}
          >
            Add more
          </Button>
        </div>
      </Col>
    </Row>

    <HorizontalLine className="mb-4" />

    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>Notable Investors</h4>
        <Accordion>
          <AccordionElement isOpened={true} title="First Name">
            <FormField label="First name" name="firstName" />
            <FormField label="Surname" name="surName" />
          </AccordionElement>
        </Accordion>
        <div className="p-4 text-center">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={plusIcon}
            onClick={() => {}}
            disabled={true}
          >
            Add more
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-4" />

    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>Advisors</h4>
        <Accordion>
          <AccordionElement isOpened={true} title="First Name">
            <FormField label="First name" name="firstName" />
            <FormField label="Surname" name="surName" />
          </AccordionElement>
        </Accordion>
        <div className="p-4 text-center">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={plusIcon}
            onClick={() => {}}
            disabled={true}
          >
            Add more
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-5" />
    <div className="text-center">
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
    title="Team and Investors"
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
