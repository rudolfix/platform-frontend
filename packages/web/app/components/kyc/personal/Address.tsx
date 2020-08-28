import { Button, ButtonGroup, EButtonLayout, EButtonSize } from "@neufund/design-system";
import {
  IKycIndividualData,
  kycApi,
  KycPersonalAddressSchemaRequired,
} from "@neufund/shared-modules";
import { ECountries } from "@neufund/shared-utils";
import { FormikProps, withFormik } from "formik";
import defaultTo from "lodash/fp/defaultTo";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import {
  FormDeprecated,
  FormField,
  FormSelectCountryField,
  FormSelectStateField,
} from "../../shared/forms";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { EKycUploadType } from "../../shared/MultiFileUpload";
import { KYCAddDocuments } from "../shared/AddDocuments";
import { KycStep } from "../shared/KycStep";
import { TOTAL_STEPS_PERSONAL_KYC } from "./constants";

import * as styles from "./Start.module.scss";

interface IStateProps {
  currentValues?: IKycIndividualData;
  loadingData: boolean;
  isSavingForm: boolean;
  uploadedFiles: ReturnType<typeof kycApi.selectors.selectKycUploadedFiles>;
  uploadedFilesLoading: ReturnType<typeof kycApi.selectors.selectIndividualFilesLoading>;
  individualFilesUploading: ReturnType<typeof kycApi.selectors.selectIndividualFilesUploading>;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
  submitAndClose: (values: IKycIndividualData) => void;
  goBack: () => void;
}

type TProps = IStateProps & IDispatchProps & FormikProps<IKycIndividualData>;

const KYCForm: React.FunctionComponent<TProps> = ({
  uploadedFiles,
  values,
  uploadedFilesLoading,
  individualFilesUploading,
  ...props
}) => {
  const shouldDisableSubmit =
    uploadedFilesLoading ||
    !props.isValid ||
    props.loadingData ||
    uploadedFiles.length === 0 ||
    individualFilesUploading;

  return (
    <>
      <KycStep
        step={3}
        allSteps={TOTAL_STEPS_PERSONAL_KYC}
        title={<FormattedMessage id="kyc.personal.address.title" />}
        description={<FormattedMessage id="kyc.personal.address.description" />}
        buttonAction={() => props.submitAndClose(values)}
        data-test-id="kyc.individual-address"
      />
      <FormDeprecated>
        <FormField
          label={<FormattedMessage id="form.label.street-and-number" />}
          name="street"
          data-test-id="kyc-personal-address-street"
        />
        <FormField
          label={<FormattedMessage id="form.label.additional-information" />}
          name="additionalInformation"
          data-test-id="kyc-personal-address-additional"
        />
        {/*TODO: Remove while reworking inputs*/}
        <span>
          <FormattedMessage id="form.label.additional-information.description" />
        </span>
        <Row>
          <Col xs={12} md={6} lg={8}>
            <FormField
              label={<FormattedMessage id="form.label.city" />}
              name="city"
              data-test-id="kyc-personal-start-city"
            />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <FormField
              label={<FormattedMessage id="form.label.zip-code" />}
              name="zipCode"
              data-test-id="kyc-personal-start-zip-code"
            />
          </Col>
        </Row>

        <Row>
          {values.country === ECountries.UNITED_STATES && (
            <Col xs={12} md={6} lg={6}>
              <FormSelectStateField
                label={<FormattedMessage id="form.label.us-state" />}
                name="usState"
                data-test-id="kyc-personal-start-us-state"
              />
            </Col>
          )}

          <Col>
            <FormSelectCountryField
              label={<FormattedMessage id="form.label.country-address" />}
              name="country"
              data-test-id="kyc-personal-start-country"
              disabled={true}
            />
          </Col>
        </Row>

        <KYCAddDocuments
          uploadType={EKycUploadType.PROOF_OF_ADDRESS}
          isLoading={props.isSavingForm}
        />

        <ButtonGroup className={styles.buttons}>
          <Button
            layout={EButtonLayout.SECONDARY}
            size={EButtonSize.HUGE}
            className={styles.button}
            data-test-id="kyc-personal-address-go-back"
            onClick={props.goBack}
          >
            <FormattedMessage id="form.back" />
          </Button>
          <Button
            type="submit"
            layout={EButtonLayout.PRIMARY}
            size={EButtonSize.HUGE}
            className={styles.button}
            isLoading={props.isSavingForm}
            disabled={shouldDisableSubmit}
            data-test-id="kyc-personal-address-submit-form"
          >
            <FormattedMessage id="form.save-and-submit" />
          </Button>
        </ButtonGroup>
      </FormDeprecated>
    </>
  );
};

const defaultEmptyObject = defaultTo<IKycIndividualData | {}>({});

const KYCEnhancedForm = withFormik<IStateProps & IDispatchProps, IKycIndividualData>({
  validationSchema: KycPersonalAddressSchemaRequired,
  validateOnMount: true,
  enableReinitialize: true,
  mapPropsToValues: props => defaultEmptyObject(props.currentValues),
  handleSubmit: (values, { props }) => {
    props.submitForm(values);
  },
})(KYCForm);

export const KYCPersonalAddress = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: kycApi.selectors.selectIndividualData(state),
      loadingData: kycApi.selectors.selectIndividualDataLoading(state),
      isSavingForm: kycApi.selectors.selectIsSavingKycForm(state),
      uploadedFiles: kycApi.selectors.selectIndividualFiles(state),
      uploadedFilesLoading: kycApi.selectors.selectIndividualFilesLoading(state),
      individualFilesUploading: kycApi.selectors.selectIndividualFilesUploading(state),
    }),
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCIndividualStart()),
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitPersonalAddress(values)),
      submitAndClose: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitPersonalAddressAndClose(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
  branch<IStateProps>(props => props.loadingData, renderComponent(LoadingIndicator)),
)(KYCEnhancedForm);
