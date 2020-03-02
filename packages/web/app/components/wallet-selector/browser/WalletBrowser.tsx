import { Button, Checkbox, EButtonLayout, EButtonWidth, TextField, } from "@neufund/design-system";
import { injectIntlHelpers, withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent } from "recompose";
import { compose } from "recompose";
import * as Yup from "yup";
import { FormikErrors } from "formik";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { selectIsMessageSigning } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/loading-indicator/index";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";
import { EWalletType } from "../../../modules/web3/types";
import { WalletChooser } from "../WalletChooser";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { Form } from "../../shared/forms/Form";
import { IIntlHelpers } from "../../../../../shared/src/utils/injectIntlHelpers.unsafe";

import notificationSign from "../../../assets/img/notifications/warning.svg";
import * as styles from "./WalletBrowser.module.scss";

interface IWalletBrowserProps {
  errorMessage?: TMessage;
  isLoading: boolean;
  isMessageSigning: boolean;
}

interface IWalletBrowserDispatchProps {
  tryConnectingWithBrowserWallet: () => void;
}

type TMetamaskErrorProps = {
  errorMessage: TMessage;
  tryConnectingWithBrowserWallet: () => void;
};

type TFormValues = {
  email: string;
  tos: boolean
}

type TEmailTosFormProps = {
  intl: IIntlHelpers,
  isLoading: boolean,
  submitForm: (email: string) => void,
  defaultFormValues: TFormValues,
  errorMessage: TMessage | undefined
}

export const WalletLoading = () => <LoadingIndicator className={styles.loadingIndicator} />;

const EMAIL = "email";
const TOS = "tos";

const validationSchema = Yup.object().shape({
  [EMAIL]: Yup.string()
    .required()
    .email(),
  [TOS]: Yup.boolean()
    .required()
    .test("tos-is-true", <FormattedMessage id="wallet-selector.register.accept.tos" />, value => value === true)
});

export const BrowserWalletAskForEmailAndTosForm: React.FunctionComponent<TEmailTosFormProps> = ({
  intl,
  isLoading,
  submitForm,
  defaultFormValues,
  errorMessage
}) => (
  <Form<TFormValues>
    validationSchema={validationSchema}
    initialValues={defaultFormValues}
    initialErrors={{ email: errorMessage && getMessageTranslation(errorMessage) } as FormikErrors<TFormValues>}
    initialTouched={{ email: !!errorMessage }}
    validateOnMount={!errorMessage}
    validateOnBlur={false}
    onSubmit={values => submitForm(values.email)}
    className={styles.form}
  >
    {({ isSubmitting, isValid }) => (
      <>
        <TextField
          type="text"
          isRequired={true}
          name={EMAIL}
          placeholder={intl.formatIntlMessage("wallet-selector.register.email.placeholder")}
          label={intl.formatIntlMessage("wallet-selector.register.email")}
          data-test-id="wallet-selector-register-email"
        />
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
          <FormattedMessage id="wallet-selector.neuwallet.register" />
        </Button>
      </>
    )}
  </Form>
);

export const BrowserWalletAskForEmailAndTos = compose<TEmailTosFormProps, TEmailTosFormProps>(
  injectIntlHelpers
)(BrowserWalletAskForEmailAndTosForm);

export const MetamaskErrorBase: React.FunctionComponent<TMetamaskErrorProps> = ({
  errorMessage,
  tryConnectingWithBrowserWallet,
}) => (
  <>
    <div data-test-id="browser-wallet-error-msg" className={styles.notification}>
      <img src={notificationSign} alt="" />
      <span> {getMessageTranslation(errorMessage)} </span>
    </div>

    <Button
      layout={EButtonLayout.PRIMARY}
      onClick={tryConnectingWithBrowserWallet}
      data-test-id="browser-wallet-init.try-again"
      className={styles.button}
    >
      <FormattedMessage id="common.try-again" />
    </Button>
  </>
);

export type TWalletBrowserBaseProps = {
  rootPath: string,
  showWalletSelector: boolean
}

export const WalletBrowserBase: React.FunctionComponent<TWalletBrowserBaseProps> = ({
  rootPath,
  showWalletSelector,
  children
}) =>
  (
    <>
      {console.log("WalletSelectorRegisterLayout")}
      <div className={styles.wrapper} data-test-id="wallet-selector">
        <h1 className={styles.title}>
          <FormattedMessage id="wallet-selector.sign-up" />
        </h1>
        <section className={styles.main}>
          <FormattedMessage id="wallet-selector.browser-wallet-provide-signature" />
          {children}
          <p className={styles.help}>
            <FormattedHTMLMessage
              tagName="span"
              id="wallet-selector.browser-wallet.help"
              values={{ metamaskSupportLink: externalRoutes.metamaskSupportLink }}
            />
          </p>
        </section>
        {showWalletSelector && (
          <WalletChooser rootPath={rootPath} activeWallet={EWalletType.BROWSER} />
        )}
      </div>

    </>
  );

export const MetamaskError = compose<TMetamaskErrorProps,TMetamaskErrorProps>(
  appConnect<IWalletBrowserProps, IWalletBrowserDispatchProps>({
    dispatchToProps: dispatch => ({
      tryConnectingWithBrowserWallet: () => {
        dispatch(actions.walletSelector.browserWalletSignMessage());
      },
    }),
  }),
)( MetamaskErrorBase);

export const WalletBrowser = compose(
  appConnect<IWalletBrowserProps, IWalletBrowserDispatchProps>({
    stateToProps: state => ({
      errorMessage: state.walletSelector.messageSigningError as TMessage,
      isLoading: state.walletSelector.isLoading,
      isMessageSigning: selectIsMessageSigning(state),
    }),
    dispatchToProps: dispatch => ({
      tryConnectingWithBrowserWallet: () => {
        dispatch(actions.walletSelector.tryConnectingWithBrowserWallet());
      },
      cancelSigning: () => {
        dispatch(actions.walletSelector.reset());
      },
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.walletSelector.tryConnectingWithBrowserWallet());
    },
  }),
  withContainer(WalletBrowserBase),
  branch<IWalletBrowserProps>(
    ({ isLoading, isMessageSigning }) => isLoading || isMessageSigning,
    renderComponent(WalletLoading),
  ),
  branch<IWalletBrowserProps>(
    ({ errorMessage }) => errorMessage !== undefined,
    renderComponent(MetamaskErrorBase),
  ),
)(() => null);
