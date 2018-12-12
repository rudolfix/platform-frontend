import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWalletType } from "../../../modules/web3/types";
import { withModalBody } from "../../../utils/storybookHelpers";
import {
  BrowserWalletErrorMessage,
  MismatchedWalletAddressErrorMessage,
} from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { AccessWalletContainerComponent } from "./AccessWalletModal";

const props = {
  title: "Verify your email",
  message: "By confirming this request, your email will be updated",
  errorMsg: undefined,
  isUnlocked: false,
  onAccept: () => {},
  walletType: EWalletType.LIGHT,
};

storiesOf("AccessWalletModal", module)
  .addDecorator(withModalBody())
  .add("lightwallet", () => <AccessWalletContainerComponent {...props} />)
  .add("lightwallet-unlocked", () => (
    <AccessWalletContainerComponent {...props} isUnlocked={true} />
  ))
  .add("metamask", () => (
    <AccessWalletContainerComponent {...props} walletType={EWalletType.BROWSER} />
  ))
  .add("metamask with error", () => {
    const data = {
      ...props,
      errorMessage: createMessage(BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK),
    };
    return <AccessWalletContainerComponent {...data} walletType={EWalletType.BROWSER} />;
  })
  .add("ledger", () => (
    <AccessWalletContainerComponent {...props} walletType={EWalletType.LEDGER} />
  ))
  .add("ledger with error", () => {
    const testData = {
      ...props,
      errorMessage: createMessage(MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS, {
        actualAddress: "12345",
        desiredAddress: "56789",
      }),
    };
    return <AccessWalletContainerComponent {...testData} walletType={EWalletType.LEDGER} />;
  });
