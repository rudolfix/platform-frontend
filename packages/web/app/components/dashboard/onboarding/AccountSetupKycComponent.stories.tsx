import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  AccountSetupKycStartLayout,
  IAccountSetupKycStartLayoutProps,
} from "./AccountSetupKycComponent";

const props: IAccountSetupKycStartLayoutProps = {
  onGoToKycHome: action("GO_TO_KYC_HOME"),
  isLoading: false,
  error: false,
};

storiesOf("Onboarding ", module)
  .add("AccountSetup default", () => <AccountSetupKycStartLayout {...props} />)
  .add("AccountSetup loading", () => <AccountSetupKycStartLayout {...props} isLoading />)
  .add("AccountSetup error", () => <AccountSetupKycStartLayout {...props} error />);
