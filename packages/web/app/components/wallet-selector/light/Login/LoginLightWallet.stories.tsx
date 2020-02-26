import { IIntlHelpers } from "@neufund/shared";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ELogoutReason } from "../../../../modules/auth/types";
import { TMessage } from "../../../translatedMessages/utils";
import { WalletSelectorLayoutContainer } from "../../WalletSelectorLayout";
import { LoginLightWalletLayout } from "./LoginLightWallet";
import { MissingEmailLightWallet } from "./MissingEmailLightWallet";

storiesOf("LoginLightWallet", module)
  .add("Without email set", () => (
    <WalletSelectorLayoutContainer isLoginRoute={true} logoutReason={undefined}>
      <MissingEmailLightWallet goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")} />
    </WalletSelectorLayoutContainer>
  ))
  .add("With valid mail set", () => (
    <WalletSelectorLayoutContainer isLoginRoute={true} logoutReason={undefined}>
      <LoginLightWalletLayout
        isLoading={false}
        errorMsg={undefined}
        email="mail@neufund.org"
        goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")}
        submitForm={action("SUBMIT_FORM")}
        intl={{} as IIntlHelpers}
      />
    </WalletSelectorLayoutContainer>
  ))
  .add("With logout reason", () => (
    <WalletSelectorLayoutContainer isLoginRoute={true} logoutReason={ELogoutReason.SESSION_TIMEOUT}>
      <LoginLightWalletLayout
        isLoading={false}
        errorMsg={undefined}
        email="mail@neufund.org"
        goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")}
        submitForm={action("SUBMIT_FORM")}
        intl={{} as IIntlHelpers}
      />
    </WalletSelectorLayoutContainer>
  ))
  .add("With password error", () => (
    <WalletSelectorLayoutContainer isLoginRoute={true} logoutReason={undefined}>
      <LoginLightWalletLayout
        isLoading={false}
        errorMsg={{ messageType: "lightWalletWrongPassword" } as TMessage}
        email="mail@neufund.org"
        goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")}
        submitForm={action("SUBMIT_FORM")}
        intl={{} as IIntlHelpers}
      />
    </WalletSelectorLayoutContainer>
  ));
