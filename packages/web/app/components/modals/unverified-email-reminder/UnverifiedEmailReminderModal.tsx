import { Button, EButtonLayout, EButtonSize, EButtonWidth } from "@neufund/design-system";
import { assertNever } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import mailLink from "../../../assets/img/login-link.svg";
import * as styles from "./UnverifiedEmailReminderModal.module.scss";

export enum EUnverifiedEmailReminderModalType {
  LIGHT_WALLET_UNVERIFIED_EMAIL_REMINDER_MODAL = "lightWalletUnverifiedEmailReminderModal",
  BROWSER_LEDGER_UNVERIFIED_EMAIL_REMINDER_MODAL = "browserLedgerUnverifiedEmailReminderModal",
}

type TModalProps = {
  modalType: EUnverifiedEmailReminderModalType;
  unverifiedEmail: string;
  closeModal: () => void;
};

const chooseModalText = (modalType: EUnverifiedEmailReminderModalType, unverifiedEmail: string) => {
  switch (modalType) {
    case EUnverifiedEmailReminderModalType.LIGHT_WALLET_UNVERIFIED_EMAIL_REMINDER_MODAL:
      return (
        <FormattedMessage
          id="checkUnverifiedEmailModal.light-wallet"
          values={{ unverifiedEmail }}
        />
      );
    case EUnverifiedEmailReminderModalType.BROWSER_LEDGER_UNVERIFIED_EMAIL_REMINDER_MODAL:
      return (
        <FormattedMessage
          id="checkUnverifiedEmailModal.browser-ledger"
          values={{ unverifiedEmail }}
        />
      );
    default:
      assertNever(modalType);
  }
};

export const UnverifiedEmailReminderModal: React.ComponentType<TModalProps> = ({
  modalType,
  unverifiedEmail,
  closeModal,
}) => (
  <section data-test-id="unverified-email-reminder-modal" className={styles.modalBody}>
    <img src={mailLink} alt="" />
    <h3 className={styles.modalTitle}>
      <FormattedMessage id="checkUnverifiedEmailModal.title" />
    </h3>
    <p className={styles.modalText}>{chooseModalText(modalType, unverifiedEmail)}</p>
    <Button
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.NORMAL}
      width={EButtonWidth.NORMAL}
      onClick={closeModal}
    >
      <FormattedMessage id="checkUnverifiedEmailModal.button-text" />
    </Button>
  </section>
);
