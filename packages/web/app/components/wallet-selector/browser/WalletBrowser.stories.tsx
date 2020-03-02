import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BrowserWalletErrorMessage } from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { MetamaskErrorBase, WalletBrowserBase, WalletLoading } from "./WalletBrowser";

storiesOf("Wallet selector/Browser", module)
  .add("initial loading state", () => (
    <WalletBrowserBase>
      <WalletLoading />
    </WalletBrowserBase>
  ))
  .add("error message", () => (
    <WalletBrowserBase>
      <MetamaskError
        errorMessage={createMessage(BrowserWalletErrorMessage.GENERIC_ERROR)}
        tryConnectingWithBrowserWallet={action("tryConnectingWithBrowserWallet")}
      />
    </WalletBrowserBase>
  ));
