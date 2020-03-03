import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BrowserWalletErrorMessage } from "../../../translatedMessages/messages";
import { createMessage } from "../../../translatedMessages/utils";
import { MetamaskErrorBase, RegisterBrowserWalletBase, WalletLoading } from "./WalletBrowser";

storiesOf("Wallet selector/Browser", module)
  .add("initial loading state", () => (
    <BrowserWalletBase>
      <WalletLoading />
    </BrowserWalletBase>
  ))
  .add("error message", () => (
    <BrowserWalletBase>
      <MetamaskError
        errorMessage={createMessage(BrowserWalletErrorMessage.GENERIC_ERROR)}
        tryConnectingWithBrowserWallet={action("tryConnectingWithBrowserWallet")}
      />
    </BrowserWalletBase>
  ));
