import * as React from "react";

import { LoadingIndicator } from "../../../shared/LoadingIndicator";

export const SigningMessage = () => (
  <div data-test-id="modals.shared.signing-message.modal">
    <h3>Signing Transaction</h3>
    <p>Accept message on your signer</p>
    <LoadingIndicator />
  </div>
);
