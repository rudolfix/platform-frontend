import * as React from "react";

import { PanelDark } from "../shared/PanelDark";
import { ArrowLink } from "../shared/ArrowLink";

export const VerifyEmailWidget = () => (
  <PanelDark headerText="EMAIL VERIFICATION" className="bg-white w-100">
    <p className="mt-3 mb-5 ml-1 mr-1">
      You need to verify your email address, which will be used for your wallet link we send you
    </p>
    <br />
    <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
      Verify
    </ArrowLink>
  </PanelDark>
);
