import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BrowserWalletErrorMessage } from "../../../translatedMessages/messages";
import { createMessage } from "../../../translatedMessages/utils";
import { WalletLoading } from "../../shared/WalletLoading";
import { BrowserWalletBase } from "../Register/BrowserWalletBase";
import { RegisterBrowserWalletError } from "../Register/RegisterBrowserWalletError";

storiesOf("Wallet selector/Browser", module)
  .add("initial loading state", () => (
    <BrowserWalletBase
    showWalletSelector={true}
    rootPath="/register">
      <WalletLoading />
    </BrowserWalletBase>
  ))
  .add("error message", () => (
    <BrowserWalletBase
    showWalletSelector={true}
    rootPath="/register">
      <RegisterBrowserWalletError
        errorMessage={createMessage(BrowserWalletErrorMessage.GENERIC_ERROR)}
        tryConnectingWithBrowserWallet={action("tryConnectingWithBrowserWallet")}
      />
    </BrowserWalletBase>
  ));
