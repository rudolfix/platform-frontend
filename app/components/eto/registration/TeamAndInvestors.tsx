import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { Button } from "../../shared/Buttons";
import { FormTextArea } from "../../shared/forms/formField/FormTextArea";
import { FormField } from "../../shared/forms/forms";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { SingleFileUpload } from "../../shared/SingleFileUpload";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";
import { EtoDataSchema, IEtoData } from "../../../lib/api/EtoApi.interfaces";

interface IStateProps {
  currentValues: IEtoData;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;
// TODO: Add translations to forms
const EtoForm = (formikBag: FormikProps<IEtoData> & IProps) => (
  <Form>
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>
          <FormattedMessage id="components.eto.registration.team-and-investors.founders" />
        </h4>
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
            <FormattedMessage id="components.eto.registration.team-and-investors.add-new-owner" />
          </Button>
        </div>
      </Col>
    </Row>

    <HorizontalLine className="mb-4" />

    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>
          <FormattedMessage id="components.eto.registration.team-and-investors.cap-table" />
        </h4>
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
            <FormattedMessage id="components.eto.registration.team-and-investors.add-more" />
          </Button>
        </div>
      </Col>
    </Row>

    <HorizontalLine className="mb-4" />

    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>
          <FormattedMessage id="components.eto.registration.team-and-investors.notable-investors" />
        </h4>
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
            <FormattedMessage id="components.eto.registration.team-and-investors.add-more" />
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-4" />

    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>
          <FormattedMessage id="components.eto.registration.team-and-investors.advisors" />
        </h4>
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
            <FormattedMessage id="components.eto.registration.team-and-investors.add-more" />
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-5" />
    <div className="text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        <FormattedMessage id="components.eto.registration.team-and-investors.submit-and-continue" />
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoData>({
  validationSchema: EtoDataSchema,
  isInitialValid: (props: any) => EtoDataSchema.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationTeamAndInvestorsComponent: React.SFC<IProps & IIntlProps> = ({
  intl: { formatIntlMessage },
  ...props
}) => (
  <Row>
    <Col xs={12} lg={{ size: 8, offset: 2 }}>
      <EtoRegistrationPanel
        steps={4}
        currentStep={1}
        title={formatIntlMessage("components.eto.registration.team-and-investors.title")}
        hasBackButton={false}
        isMaxWidth={true}
      >
        <EtoEnhancedForm {...props} />
      </EtoRegistrationPanel>
    </Col>
  </Row>
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
  injectIntlHelpers,
)(EtoRegistrationTeamAndInvestorsComponent);
