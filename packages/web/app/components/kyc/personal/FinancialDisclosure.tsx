import { Button, ButtonGroup, EButtonLayout, EButtonSize } from "@neufund/design-system";
import {
  IKycIndividualData,
  kycApi,
  KycPersonalDataSchemaWithFinancialDisclosureRequired,
} from "@neufund/shared-modules";
import { FormikProps, withFormik } from "formik";
import { defaultTo } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import {
  BOOL_FALSE_KEY,
  BOOL_TRUE_KEY,
  FormSelectField,
  NONE_KEY,
} from "../../shared/forms/fields/form-select-fields/FormSelectField";
import { FormDeprecated } from "../../shared/forms/FormDeprecated";
import { KycStep } from "../shared/KycStep";
import { TOTAL_STEPS_PERSONAL_KYC } from "./constants";

import * as styles from "./Start.module.scss";

const DROPDOWN_ANSWERS = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no" />,
};

interface IStateProps {
  currentValues?: IKycIndividualData;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
  submitAndClose: (values: IKycIndividualData) => void;
  goBack: () => void;
}

export const FinancialDisclosure: React.FunctionComponent<FormikProps<IKycIndividualData> &
  IStateProps &
  IDispatchProps> = props => {
  const { isValid, values } = props;
  const shouldDisableSubmit = !isValid;

  return (
    <>
      <KycStep
        step={4}
        allSteps={TOTAL_STEPS_PERSONAL_KYC}
        title={<FormattedMessage id="kyc.personal.financial-disclosure.title" />}
        description={<FormattedMessage id="kyc.personal.financial-disclosure.description" />}
        buttonAction={() => props.submitAndClose(values)}
        data-test-id="kyc.individual-financial-disclosure"
      />

      <FormDeprecated>
        <FormSelectField
          values={DROPDOWN_ANSWERS}
          label={<FormattedMessage id="kyc.personal.financial-disclosure.dropdown" />}
          name="isHighIncome"
          data-test-id="kyc-personal-is-high-income"
        />

        <ButtonGroup className={styles.buttons}>
          <Button
            layout={EButtonLayout.SECONDARY}
            size={EButtonSize.HUGE}
            className={styles.button}
            data-test-id="kyc-personal-financial-disclosure-go-back"
            onClick={props.goBack}
          >
            <FormattedMessage id="form.back" />
          </Button>
          <Button
            type="submit"
            layout={EButtonLayout.PRIMARY}
            size={EButtonSize.HUGE}
            className={styles.button}
            disabled={shouldDisableSubmit}
            data-test-id="kyc-personal-financial-disclosure-submit-form"
          >
            <FormattedMessage id="form.save-and-submit" />
          </Button>
        </ButtonGroup>
      </FormDeprecated>
    </>
  );
};

const defaultEmptyObject = defaultTo<IKycIndividualData | {}>({});

const FinancialDisclosureForm = withFormik<IStateProps & IDispatchProps, IKycIndividualData>({
  validationSchema: KycPersonalDataSchemaWithFinancialDisclosureRequired,
  validateOnMount: true,
  enableReinitialize: true,
  isInitialValid: (props: object) =>
    KycPersonalDataSchemaWithFinancialDisclosureRequired.isValidSync(
      (props as IStateProps).currentValues,
    ),
  mapPropsToValues: props => defaultEmptyObject(props.currentValues),
  handleSubmit: (values, props) => {
    props.props.submitForm(values);
  },
})(FinancialDisclosure);

export const KYCFinancialDisclosure = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: kycApi.selectors.selectIndividualData(state),
    }),
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCIndividualAddress()),
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitFinancialDisclosure(values)),
      submitAndClose: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitFinancialDisclosure(values, true)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
)(FinancialDisclosureForm);
