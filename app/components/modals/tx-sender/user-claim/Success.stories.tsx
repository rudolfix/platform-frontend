import { storiesOf } from "@storybook/react";
import * as React from "react";
import { UserClaimSuccessComponent } from "./Success";

storiesOf("User Claim success", module).add("default", () => (
  <UserClaimSuccessComponent goToPortfolio={() => {}} tokenName="test" />
));
