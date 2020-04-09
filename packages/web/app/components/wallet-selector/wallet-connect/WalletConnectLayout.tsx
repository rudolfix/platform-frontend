import { Button, EButtonLayout } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";
import { WalletSelectorContainer } from "../WalletSelectorContainer";

import * as styles from "../WalletSelectorLayout.module.scss";

type TErrorProps = {
  error: TMessage;
  walletConnectStart: () => void;
};

export const WalletConnectError: React.FunctionComponent<TErrorProps> = ({
  error,
  walletConnectStart,
}) => (
  <>
    <div>{getMessageTranslation(error)}</div>
    <Button
      layout={EButtonLayout.PRIMARY}
      type="button"
      onClick={walletConnectStart}
      data-test-id="eto-flow-start-bookbuilding"
    >
      retry
    </Button>
  </>
);

export const WalletConnectLayout: React.FunctionComponent = ({ children }) => (
  <div className="justify-content-center text-center">
    <WalletSelectorContainer data-test-id="wallet-selector">
      <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
        <FormattedMessage id="wallet-selector.tabs.wallet-connect-login" />
      </h1>
      <section className="mt-4">{children}</section>
    </WalletSelectorContainer>
  </div>
);
