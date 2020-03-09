import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BrowserWalletErrorMessage } from "../../../translatedMessages/messages";
import { createMessage } from "../../../translatedMessages/utils";
import { WalletLoading } from "../../shared/WalletLoading";
import { RegisterBrowserWalletContainer } from "../register/RegisterBrowserWalletContainer";
import { RegisterBrowserWalletError } from "../register/RegisterBrowserWalletError";

storiesOf("Wallet selector/Browser", module)
  .add("initial loading state", () => (
    <RegisterBrowserWalletContainer showWalletSelector={true} rootPath="/register">
      <WalletLoading />
    </RegisterBrowserWalletContainer>
  ))
  .add("error message", () => (
    <RegisterBrowserWalletContainer showWalletSelector={true} rootPath="/register">
      <RegisterBrowserWalletError
        errorMessage={createMessage(BrowserWalletErrorMessage.GENERIC_ERROR)}
        tryConnectingWithBrowserWallet={action("tryConnectingWithBrowserWallet")}
      />
    </RegisterBrowserWalletContainer>
  ));
