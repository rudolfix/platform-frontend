import { EWalletSubType, EWalletType } from "@neufund/shared-modules";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../utils/react-connected-components/storybookHelpers.unsafe";
import {
  BrowserWalletErrorMessage,
  getMessageTranslation,
  MismatchedWalletAddressErrorMessage,
} from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { AccessWalletLayout } from "./AccessWallet";

import * as styles from "./AccessWalletModal.module.scss";

const props = {
  title: "Action that must be accepted by user",
  message: "Description and additional info about the action required",
  errorMsg: undefined,
  onAccept: action("onAccept"),
  tryToAccessWalletAgain: action("tryToAccessWalletAgain"),
  walletType: EWalletType.LIGHT,
  walletSubType: EWalletSubType.UNKNOWN,
};

storiesOf("AccessWalletModal", module)
  .addDecorator(withModalBody(styles.main, styles.modalBody))
  .add("lightwallet", () => <AccessWalletLayout {...props} />)
  .add("lightwallet with changed label and empty message", () => (
    <AccessWalletLayout {...props} inputLabel={"This is changed label"} message={""} />
  ))
  .add("browser: metamask", () => (
    <AccessWalletLayout
      {...props}
      walletType={EWalletType.BROWSER}
      walletSubType={EWalletSubType.METAMASK}
    />
  ))
  .add("browser: gnosis", () => (
    <AccessWalletLayout
      {...props}
      walletType={EWalletType.BROWSER}
      walletSubType={EWalletSubType.GNOSIS}
    />
  ))
  .add("browser: metamask with error", () => {
    const data = {
      ...props,
      errorMessage: getMessageTranslation(
        createMessage(BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK),
      ),
    };
    return (
      <AccessWalletLayout
        {...data}
        walletType={EWalletType.BROWSER}
        walletSubType={EWalletSubType.METAMASK}
      />
    );
  })
  .add("ledger", () => <AccessWalletLayout {...props} walletType={EWalletType.LEDGER} />)
  .add("ledger with error", () => {
    const testData = {
      ...props,
      errorMessage: getMessageTranslation(
        createMessage(MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS, {
          actualAddress: "12345",
          desiredAddress: "56789",
        }),
      ),
    };
    return <AccessWalletLayout {...testData} walletType={EWalletType.LEDGER} />;
  })
  .add("walletConnect: Neufund", () => (
    <AccessWalletLayout
      {...props}
      walletType={EWalletType.WALLETCONNECT}
      walletSubType={EWalletSubType.NEUFUND}
    />
  ))
  .add("walletConnect: unknown", () => (
    <AccessWalletLayout {...props} walletType={EWalletType.WALLETCONNECT} />
  ));
