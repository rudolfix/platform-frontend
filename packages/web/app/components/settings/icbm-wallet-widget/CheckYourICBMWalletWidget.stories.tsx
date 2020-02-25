import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { CheckYourICBMWalletWidgetComponent } from "./CheckYourICBMWalletWidget";

storiesOf("CheckYourICBMWalletWidget", module).add("default", () => (
  <CheckYourICBMWalletWidgetComponent loadICBMWallet={action("loadICBMWallet")} />
));
