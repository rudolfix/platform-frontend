import { Button, EButtonLayout } from "@neufund/design-system";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { getMessageTranslation } from "../../../../translatedMessages/messages";
import { TMessage } from "../../../../translatedMessages/utils";

import notificationSign from "../../../../../assets/img/notifications/warning.svg";
import * as styles from "./DefaultLedgerError.module.scss";

export type TLedgerErrorProps = {
  errorMessage: TMessage;
  tryToEstablishConnectionWithLedger: () => void;
};

export const DefaultLedgerError: React.FunctionComponent<TLedgerErrorProps> = ({
  errorMessage,
  tryToEstablishConnectionWithLedger,
}) => (
  <section className="text-center">
    <div
      data-test-id="browser-wallet-error-msg"
      className={cn(styles.notification, "mb-4 mr-3 ml-3")}
    >
      <img src={notificationSign} alt="" />
      <span data-test-id="ledger-wallet-error-msg">
        <FormattedMessage id="wallet-selector.ledger.start.connection-status" />
        {getMessageTranslation(errorMessage)}
      </span>
    </div>

    <Button
      layout={EButtonLayout.PRIMARY}
      className="mb-3"
      onClick={tryToEstablishConnectionWithLedger}
      data-test-id="ledger-wallet-init.try-again"
    >
      <FormattedMessage id="common.try-again" />
    </Button>
  </section>
);
