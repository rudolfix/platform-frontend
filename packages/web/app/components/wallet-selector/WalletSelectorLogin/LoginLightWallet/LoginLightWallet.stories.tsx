import { IIntlHelpers } from "@neufund/shared";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TMessage } from "../../../translatedMessages/utils";
import { LoginLightWalletComponent } from "./LoginLightWallet";
import { MissingEmailLightWallet } from "./MissingEmailLightWallet";

storiesOf("Wallet selector/light/login", module)
  .add("Without email set", () => (
    <MissingEmailLightWallet
      goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")}
    />
  ))
  .add("With valid mail set", () => (
    <LoginLightWalletComponent
      showLogoutReason={false}
      isLoading={false}
      errorMsg={undefined}
      email="mail@neufund.org"
      goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")}
      submitForm={action("SUBMIT_FORM")}
      intl={{} as IIntlHelpers}
    />
  ))
  .add("With logout reason", () => (
    <LoginLightWalletComponent
      showLogoutReason={true}
      isLoading={false}
      errorMsg={undefined}
      email="mail@neufund.org"
      goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")}
      submitForm={action("SUBMIT_FORM")}
      intl={{} as IIntlHelpers}
    />
  ))
  .add("With password error", () => (
    <LoginLightWalletComponent
      showLogoutReason={false}
      isLoading={false}
      errorMsg={{ messageType: "lightWalletWrongPassword" } as TMessage}
      email="mail@neufund.org"
      goToPasswordRecovery={action("GO_TO_PASSWORD_RECOVERY")}
      submitForm={action("SUBMIT_FORM")}
      intl={{} as IIntlHelpers}
    />
  ));
