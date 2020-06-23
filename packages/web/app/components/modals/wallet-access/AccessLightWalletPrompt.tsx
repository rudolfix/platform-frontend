import { Button, EButtonLayout } from "@neufund/design-system";
import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../types";
import { FormDeprecated, FormField } from "../../shared/forms";

import * as styles from "./AccessWalletModal.module.scss";

interface IStateProps {
  inputLabel?: TTranslatedString;
}

interface IOwnProps {
  onCancel?: () => void;
  onAccept: (password?: string) => void;
}

type IProps = IStateProps & IOwnProps;

export interface IFormValues {
  password: string;
}

const AccessLightWalletForm = ({ values, inputLabel }: FormikProps<IFormValues> & IProps) => (
  <FormDeprecated
    className={styles.accessLightWalletForm}
    data-test-id="access-light-wallet-locked"
  >
    <p className={styles.accessLightWalletFormLabel}>
      {inputLabel || <FormattedMessage id="modal.light-wallet.message" />}
    </p>
    <FormField
      type="password"
      placeholder="Password"
      name="password"
      data-test-id="access-light-wallet-password-input"
    />
    <Button
      type="submit"
      layout={EButtonLayout.PRIMARY}
      disabled={!values.password}
      data-test-id="access-light-wallet-confirm"
      className={styles.accessLightWalletFormButton}
    >
      <FormattedMessage id="modal.light-wallet.button.accept" />
    </Button>
  </FormDeprecated>
);

export const AccessLightWalletPrompt = withFormik<IProps, IFormValues>({
  handleSubmit: (values, { props }) => props.onAccept(values.password),
})(AccessLightWalletForm);
