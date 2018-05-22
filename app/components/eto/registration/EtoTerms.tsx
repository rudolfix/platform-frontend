import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../store";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import {
  BOOL_FALSE_KEY,
  BOOL_TRUE_KEY,
  FormField,
  FormSelectField,
  NONE_KEY,
} from "../../shared/forms/forms";

import { HorizontalLine } from "../../shared/HorizontalLine";
import { SingleFileUpload } from "../../shared/SingleFileUpload";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import * as iconExternalLink from "../../../assets/img/inline_icons/link_out_small.svg";

// @todo
type IEtoData = any;

const THIRD_PARTIES_DEPENDENCY_VALUES = {
  [NONE_KEY]: "please select",
  [BOOL_TRUE_KEY]: "Yes there is",
  [BOOL_FALSE_KEY]: "No there is not",
};

const SUBJECT_OF_REGULATION_VALUES = {
  [NONE_KEY]: "please select",
  [BOOL_TRUE_KEY]: "Yes there is",
  [BOOL_FALSE_KEY]: "No there is not",
};

interface IStateProps {
  currentValues: IEtoData;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;
// TODO: Add translations to Labels
const EtoForm = (formikBag: FormikProps<IEtoData> & IProps) => (
  <Form>
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <div className="mb-4">
          <FormField
            label="How many shares do you want to tokenize?"
            placeholder="%"
            name="tokenizedSharesPercent"
          />
        </div>
        <div className="mb-4">
          <FormField label="What is the price a share?" placeholder="€" name="tokenPrice" />
        </div>
        <div className="mb-4">
          <p>
            <FormattedMessage id="components.eto.registration.eto-terms.use-three-characters" />
          </p>
          <Link to="#0">
            <Button svgIcon={iconExternalLink} layout="secondary" iconPosition="icon-after">
              <FormattedMessage id="components.eto.registration.eto-terms.etherscan" />
            </Button>
          </Link>
          <Link to="#0">
            <Button svgIcon={iconExternalLink} layout="secondary" iconPosition="icon-after">
              <FormattedMessage id="components.eto.registration.eto-terms.etherscan" />
            </Button>
          </Link>
        </div>
        <div className="mb-4">
          <FormField label="Your token Name" placeholder="XXX" name="tokenName" />
        </div>
        <SingleFileUpload
          files={[]}
          fileUploading={false}
          filesLoading={false}
          fileFormatInformation=".jpg, .svg, .png"
          uploadCta="Upload token symbol"
          onDropFile={() => {}}
        />
      </Col>
    </Row>
    <HorizontalLine className="my-4" />
    <h4 className="text-center mb-4">
      <FormattedMessage id="components.eto.registration.eto-terms.risk-assessment" />
    </h4>
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <div className="mb-4">
          <FormSelectField
            values={THIRD_PARTIES_DEPENDENCY_VALUES}
            label={
              <FormattedMessage id="components.eto.registration.eto-terms.third-party-dependency" />
            }
            name="hasDependencyOnThirdParties"
          />
          <FormSelectField
            values={SUBJECT_OF_REGULATION_VALUES}
            label={
              <FormattedMessage id="components.eto.registration.eto-terms.third-party-dependency" />
            }
            name="hasDependencyOnThirdParties"
          />
        </div>
      </Col>
    </Row>
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        <FormattedMessage id="components.eto.registration.eto-terms.save-and-continue" />
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoData>({
  // validationSchema: EtoDataSchema,
  // isInitialValid: (props: any) => EtoDataSchema.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationTermsComponent: React.SFC<IProps> = props => (
  <Row>
    <Col xs={12} lg={{ size: 8, offset: 2 }}>
      <EtoRegistrationPanel
        steps={4}
        currentStep={4}
        title="ETO Terms"
        hasBackButton={false}
        isMaxWidth={true}
      >
        <EtoEnhancedForm {...props} />
      </EtoRegistrationPanel>
    </Col>
  </Row>
);

export const EtoRegistrationTerms = compose<React.SFC>(
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
)(EtoRegistrationTermsComponent);
