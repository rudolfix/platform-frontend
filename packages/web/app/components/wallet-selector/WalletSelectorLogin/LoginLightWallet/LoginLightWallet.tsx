import {
  Button,
  ButtonInline,
  EButtonLayout,
  EButtonWidth,
  TextField,
} from "@neufund/design-system";
import { IIntlProps, injectIntlHelpers } from "@neufund/shared";
import { FormikProps, useFormikContext, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";
import * as Yup from "yup";

import { actions } from "../../../../modules/actions";
import {
  selectCurrentLightWalletEmail,
  selectLightWalletEmailFromQueryString,
  selectPreviousLightWalletEmail,
} from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { FormDeprecated } from "../../../shared/forms/index";
import { getMessageTranslation } from "../../../translatedMessages/messages";
import { TMessage } from "../../../translatedMessages/utils";
import { resetWalletOnEnter } from "../../shared/reset-wallet";
import { WalletLoading } from "../../shared/WalletLoading";
import { MissingEmailLightWallet } from "./MissingEmailLightWallet";

import * as styles from "../../shared/RegisterWalletSelector.module.scss";

interface IFormValues {
  password: string;
}

interface IStateProps {
  email?: string;
  isLoading: boolean;
  errorMsg?: TMessage;
  currentEmail?: string;
}

type TDispatchProps = {
  goToPasswordRecovery: () => void;
  submitForm: (values: IFormValues) => void;
};

const PASSWORD = "password";

const emailValidator = Yup.string().email();

export const LoginValidator = Yup.object().shape({
  password: Yup.string().required(
    <FormattedMessage id="wallet-selector.neuwallet.password-is-mandatory" />,
  ),
  email: emailValidator,
});

type TProps = IStateProps & TDispatchProps & IIntlProps;

const LoginLightWalletForm: React.FunctionComponent<TProps & FormikProps<IFormValues>> = props => {
  const { setFieldError } = useFormikContext();

  React.useEffect(() => {
    if (props.errorMsg) {
      setFieldError(PASSWORD, getMessageTranslation(props.errorMsg) as string);
    }
  }, [props.errorMsg]);

  return (
    <FormDeprecated className={styles.form}>
      <TextField
        type="password"
        placeholder={props.intl.formatIntlMessage("wallet-selector.neuwallet.login.placeholder")}
        name={PASSWORD}
        data-test-id="light-wallet-login-with-email-password-field"
        disabled={props.isLoading}
      />
      <Button
        type="submit"
        layout={EButtonLayout.PRIMARY}
        width={EButtonWidth.BLOCK}
        disabled={!props.isValid}
        isLoading={props.isLoading}
        data-test-id="wallet-selector-nuewallet.login-button"
        className={styles.buttons}
      >
        <FormattedMessage id="wallet-selector.neuwallet.login.button" />
      </Button>

      <p className={styles.forgottenPassword}>
        <FormattedMessage
          id="wallet-selector.neuwallet.forgotten-password"
          values={{
            link: (
              <ButtonInline onClick={props.goToPasswordRecovery}>
                <FormattedMessage id="wallet-selector.neuwallet.recover-password" />
              </ButtonInline>
            ),
          }}
        />
      </p>
    </FormDeprecated>
  );
};

const LoginEnhancedLightWalletForm = withFormik<TProps, IFormValues>({
  handleSubmit: (values, props) => props.props.submitForm(values),
  validationSchema: LoginValidator,
})(LoginLightWalletForm);

export const LoginLightWalletComponent: React.FunctionComponent<TProps> = props => (
  <section className={styles.main}>
    <h1 className={styles.title}>
      <FormattedMessage id="wallet-selector.log-in" />
    </h1>
    <p data-test-id="modals.wallet-selector.login-light-wallet">
      <FormattedMessage
        id="wallet-selector.neuwallet.login.prompt"
        values={{
          email: <u data-test-id="light-wallet-login-with-email-email-field">{props.email}</u>,
          lineBreak: <br />,
        }}
      />
    </p>
    <LoginEnhancedLightWalletForm {...props} />
  </section>
);

export const LoginLightWallet = compose<TProps, {}>(
  resetWalletOnEnter(),
  appConnect<IStateProps, TDispatchProps, Required<IStateProps>>({
    stateToProps: state => ({
      email:
        selectLightWalletEmailFromQueryString(state) || selectPreviousLightWalletEmail(state.web3),
      errorMsg: state.lightWalletWizard.errorMsg as TMessage,
      currentEmail: selectCurrentLightWalletEmail(state.web3),
      isLoading: state.lightWalletWizard.isLoading,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      goToPasswordRecovery: () => dispatch(actions.routing.goToPasswordRecovery()),
      submitForm: (values: IFormValues) => {
        dispatch(actions.walletSelector.lightWalletLogin(ownProps.email, values.password));
      },
    }),
  }),
  injectIntlHelpers,
  branch<IStateProps>(({ currentEmail }) => !!currentEmail, renderComponent(WalletLoading)),
  branch<IStateProps>(({ email }) => !email, renderComponent(MissingEmailLightWallet)),
)(LoginLightWalletComponent);
