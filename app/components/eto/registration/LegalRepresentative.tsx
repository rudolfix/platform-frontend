/**
 * https://app.zeplin.io/project/5a8a92c89c1a166a6a6e8f37/screen/5a9ec65430c36a8054f42d93
 * You can make this pretty much the same as the corresponding kyc page with the benefical owners etc
 * Booleans should always be dropdowns like in kyc, not like in the design
 * I think the monthly income button on this page is not needed, though, please ignore it.
 * We can also re-use the upload field from kyc here, please refactor it into a general component
 */

import * as React from "react";
import * as styles from "./LegalRepresentative.module.scss";

import { Form, FormikProps, withFormik } from "formik";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";
import { FormField } from "../../shared/forms/forms";

import { Col, Row } from "reactstrap";
import {
  EtoLegalRepresentativeSchemaRequired,
  IEtoLegalRepresentative,
} from "../../../lib/api/EtoApi.interfaces";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { FormFieldDate } from "../../shared/forms/formField/FormFieldDate";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { MultiFileUpload } from "../../shared/MultiFileUpload";

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
    <Row className="justify-content-center">
      <Col xs={12} lg={7}>
        <FormField label="First Name" name="firstName" className="mt-2" />
        <FormField label="Surname" name="surmane" className="mt-2" />
        <Row>
          <Col xs={6} lg={4}>
            <FormField label="Title" name="title" />
          </Col>
        </Row>
        <FormFieldDate label="Birth date" name="birthDate" />
        <FormField label="E-mail" name="email" type="email" />
        <FormField label="Address" name="address" />
        <Row className="mt-2">
          <Col xs={12} lg={7}>
            <FormField label="City" name="city" />
          </Col>
          <Col xs={12} lg={7}>
            <FormField label="Zip Code" name="zipCode" />
          </Col>
        </Row>
        <FormField label="Country" name="country" />
        <MultiFileUpload
          className="my-5"
          layout="business"
          onDropFile={() => { }}
          files={[]}
          fileUploading={false}
          filesLoading={false}
        />
      </Col>
      <Col xs={12} className="d-flex justify-content-center">
        <Button
          className="mt-3 mb-4"
          type="submit"
          disabled={!formikBag.isValid || formikBag.loadingData} >
          Save
          </Button>
      </Col>
    </Row>
    <HorizontalLine className="my-4" />
    <Row className="justify-content-center">
      <Col xs={12} md={7}>
        <h4 className={styles.sectionTitle}>Beneficial owners (which hold more than 25%)</h4>
        <Accordion>
          <AccordionElement title={"beneficiary name"} isOpened={true}>
            <FormField label="First Name" name="firstName" className="mt-2" />
            <FormField label="Surname" name="surmane" className="mt-2" />
            <Row>
              <Col xs={6} lg={4}>
                <FormField label="Title" name="title" />
              </Col>
            </Row>
            <FormFieldDate label="Birth date" name="birthDate" />
            <FormField label="E-mail" name="email" type="email" />
            <FormField label="Address" name="address" />
            <Row className="mt-2">
              <Col xs={12} lg={6}>
                <FormField label="City" name="city" />
              </Col>
              <Col xs={12} lg={6}>
                <FormField label="Zip Code" name="zipCode" />
              </Col>
            </Row>
            <FormField label="Country" name="country" />
            <MultiFileUpload
              className="my-5"
              layout="business"
              onDropFile={() => { }}
              files={[]}
              fileUploading={false}
              filesLoading={false}
            />
            <div className="p-4 text-center">
              <Button layout="secondary" onClick={() => { }}>
                Delete {name}
              </Button>
            </div>
          </AccordionElement>
        </Accordion>
        <div className="p-4 text-center">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={plusIcon}
            onClick={() => { }}
            disabled={true}
          >
            Add new Beneficial Owner
      </Button>
        </div>
        <small className={styles.note}>
          According to the German anti money laundering act, we are obliged to keep a record of your
          personal data for five years after account closure.
    </small>
      </Col>
    </Row>
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
      submitForm: () => { },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => { },
  }),
)(EtoRegistrationLegalRepresentativeComponent);
