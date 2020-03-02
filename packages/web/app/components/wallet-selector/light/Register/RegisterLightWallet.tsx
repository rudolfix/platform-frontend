import { Button, Checkbox, EButtonWidth, TextField } from "@neufund/design-system";
import { IIntlProps, injectIntlHelpers } from "@neufund/shared";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";
import * as Yup from "yup";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Form } from "../../../shared/forms/index";
import { TMessage } from "../../../translatedMessages/utils";

import * as styles from "./RegisterLightWallet.module.scss";

const EMAIL = "email";
const PASSWORD = "password";
const REPEAT_PASSWORD = "repeatPassword";
const TOS = "tos";

export interface IFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

export interface IStateProps {
  isLoading?: boolean;
  errorMsg?: TMessage;
}

type TRegisterWalletExternalProps = { restore?: boolean };

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
}

const validationSchema = Yup.object().shape({
  [EMAIL]: Yup.string()
    .required()
    .email(),
  [PASSWORD]: Yup.string()
    .required()
    .min(8),
  [REPEAT_PASSWORD]: Yup.string()
    .required()
    .oneOf(
      [Yup.ref(PASSWORD)],
      <FormattedMessage id="wallet-selector.neuwallet.passwords-do-not-match" />,
    ),
  [TOS]: Yup.boolean()
    .required()
    .test("tos-is-true", "You must accept the Terms of Use", value => value === true),
});

const INITIAL_VALUES = {
  email: "",
  password: "",
  repeatPassword: "",
};

const RegisterLightWalletForm: React.FunctionComponent<IStateProps &
  IDispatchProps &
  IIntlProps &
  TRegisterWalletExternalProps> = ({ intl, isLoading, submitForm, restore }) => (
  <Form<IFormValues>
    validationSchema={validationSchema}
    initialValues={INITIAL_VALUES}
    onSubmit={values => submitForm(values)}
    className={styles.form}
  >
    {({ isSubmitting, isValid, touched }) => (
      <>
        <TextField
          type="email"
          name={EMAIL}
          placeholder={intl.formatIntlMessage("wallet-selector.register.email.placeholder")}
          label={intl.formatIntlMessage("wallet-selector.register.email")}
          data-test-id="wallet-selector-register-email"
        />
        <TextField
          type="password"
          name={PASSWORD}
          placeholder={intl.formatIntlMessage("wallet-selector.register.password.placeholder")}
          label={intl.formatIntlMessage("wallet-selector.register.password")}
          data-test-id="wallet-selector-register-password"
        />
        {(restore || touched[PASSWORD]) && (
          <TextField
            type="password"
            name={REPEAT_PASSWORD}
            placeholder={intl.formatIntlMessage(
              "wallet-selector.register.confirm-password.placeholder",
            )}
            label={intl.formatIntlMessage("wallet-selector.register.confirm-password")}
            data-test-id="wallet-selector-register-confirm-password"
          />
        )}
        <Checkbox
          label={
            <FormattedHTMLMessage
              tagName="span"
              id="wallet-selector.register.tos"
              values={{ href: externalRoutes.tos }}
            />
          }
          name={TOS}
          data-test-id="wallet-selector-register-tos"
        />

          <Button
            type="submit"
            isLoading={isSubmitting || isLoading}
            disabled={!isValid}
            data-test-id="wallet-selector-register-button"
            width={EButtonWidth.BLOCK}
          >
            {restore ? (
              <FormattedMessage id="wallet-selector.neuwallet.restore" />
            ) : (
              <FormattedMessage id="wallet-selector.neuwallet.register" />
            )}
          </Button>
      </>
    )}
  </Form>
);

const RegisterEnhancedLightWalletForm = compose<
  IIntlProps & IStateProps & IDispatchProps & TRegisterWalletExternalProps,
  IStateProps & IDispatchProps & TRegisterWalletExternalProps
>(injectIntlHelpers)(RegisterLightWalletForm);

export const RegisterWithLightWalletComponent: React.FunctionComponent<IDispatchProps &
  IStateProps &
  TRegisterWalletExternalProps> = props => (
  <>
    <p className={styles.explanation}>
      <FormattedMessage id="wallet-selector.neuwallet.explanation" />
    </p>
    <RegisterEnhancedLightWalletForm {...props} />
  </>
);

export const RegisterLightWallet = compose<
  IStateProps & IDispatchProps,
  TRegisterWalletExternalProps
>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      errorMsg: state.lightWalletWizard.errorMsg as TMessage,
      isLoading: state.lightWalletWizard.isLoading,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) =>
        dispatch(actions.walletSelector.lightWalletRegister(values.email, values.password)),
    }),
  }),
)(RegisterWithLightWalletComponent);
