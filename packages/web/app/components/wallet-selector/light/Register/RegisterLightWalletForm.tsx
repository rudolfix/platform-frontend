import * as React from "react";
import { IIntlProps, injectIntlHelpers } from "../../../../../../shared/dist/utils/injectIntlHelpers.unsafe";
import { Form } from "../../../shared/forms/Form";
import { TLightWalletFormValues } from "../../../../modules/wallet-selector/types";
import { getMessageTranslation } from "../../../translatedMessages/messages";
import { FormikErrors } from "formik";
import * as styles from "./RegisterLightWallet.module.scss";
import { TextField } from "../../../../../../design-system/dist/components/inputs/TextField";
import { Checkbox } from "../../../../../../design-system/dist/components/inputs/Checkbox";
import { externalRoutes } from "../../../../config/externalRoutes";
import { Button, EButtonWidth } from "../../../../../../design-system/dist/components/buttons/Button";
import { TDispatchProps, TRegisterWalletExternalProps, TStateProps } from "./RegisterLightWallet";
import * as Yup from "yup";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

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
  TRegisterWalletExternalProps> = ({ intl, submitForm, defaultFormValues,errorMessage, restore }) => (
  <Form<TLightWalletFormValues>
    validationSchema={validationSchema}
    initialValues={defaultFormValues}
    initialErrors={{ email: errorMessage && getMessageTranslation(errorMessage) } as FormikErrors<TLightWalletFormValues>}
    initialTouched={{ email: !!errorMessage }}
    validateOnMount={!errorMessage}
    validateOnBlur={false}
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
          isLoading={isSubmitting}
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

export const RegisterEnhancedLightWalletForm = compose<
  IIntlProps & TStateProps & TDispatchProps & TRegisterWalletExternalProps,
  TStateProps & TDispatchProps & TRegisterWalletExternalProps
  >(injectIntlHelpers)(RegisterLightWalletForm);
