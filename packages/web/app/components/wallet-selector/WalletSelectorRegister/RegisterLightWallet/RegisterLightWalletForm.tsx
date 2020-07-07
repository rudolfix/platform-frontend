import { Button, Checkbox, EButtonLayout, EButtonWidth, TextField } from "@neufund/design-system";
import { FormikErrors } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";
import * as Yup from "yup";

import { externalRoutes } from "../../../../config/externalRoutes";
import { TLightWalletFormValues } from "../../../../modules/wallet-selector/types";
import { Form } from "../../../shared/forms/Form";
import { IIntlProps, injectIntlHelpers } from "../../../shared/hocs/injectIntlHelpers.unsafe";
import { getMessageTranslation } from "../../../translatedMessages/messages";
import { TDispatchProps, TRegisterWalletExternalProps, TStateProps } from "./RegisterLightWallet";

import * as styles from "../../shared/RegisterWalletSelector.module.scss";

const EMAIL = "email";
const PASSWORD = "password";
const REPEAT_PASSWORD = "repeatPassword";
const TOS = "tos";

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

export const RegisterLightWalletForm: React.FunctionComponent<TStateProps &
  TDispatchProps &
  IIntlProps &
  TRegisterWalletExternalProps> = ({
  intl,
  submitForm,
  initialFormValues,
  errorMessage,
  restore,
}) => (
  <Form<TLightWalletFormValues>
    validationSchema={validationSchema}
    initialValues={initialFormValues}
    initialErrors={
      { email: errorMessage && getMessageTranslation(errorMessage) } as FormikErrors<
        TLightWalletFormValues
      >
    }
    initialTouched={{ email: !!errorMessage }}
    validateOnMount={!errorMessage}
    validateOnBlur={false}
    onSubmit={values => submitForm(values)}
    className={styles.form}
  >
    {({ isSubmitting, isValid, touched }) => {
      const shouldShowSecondPasswordField = !!(restore || touched[PASSWORD]);
      return (
        <>
          <TextField
            type="email"
            name={EMAIL}
            isRequired={true}
            placeholder={intl.formatIntlMessage("wallet-selector.register.email.placeholder")}
            label={intl.formatIntlMessage("wallet-selector.register.email")}
            data-test-id="wallet-selector-register-email"
          />
          <TextField
            type="password"
            name={PASSWORD}
            isRequired={true}
            placeholder={intl.formatIntlMessage("wallet-selector.register.password.placeholder")}
            label={intl.formatIntlMessage("wallet-selector.register.password")}
            data-test-id="wallet-selector-register-password"
          />
          {shouldShowSecondPasswordField && (
            <TextField
              type="password"
              name={REPEAT_PASSWORD}
              isRequired={true}
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
            isLoading={isSubmitting}
            disabled={!isValid}
            data-test-id="wallet-selector-register-button"
            width={EButtonWidth.BLOCK}
            layout={EButtonLayout.PRIMARY}
          >
            {restore ? (
              <FormattedMessage id="wallet-selector.neuwallet.restore" />
            ) : (
              <FormattedMessage id="wallet-selector.neuwallet.register" />
            )}
          </Button>
        </>
      );
    }}
  </Form>
);

export const RegisterEnhancedLightWalletForm = compose<
  IIntlProps & TStateProps & TDispatchProps & TRegisterWalletExternalProps,
  TStateProps & TDispatchProps & TRegisterWalletExternalProps
>(injectIntlHelpers)(RegisterLightWalletForm);
