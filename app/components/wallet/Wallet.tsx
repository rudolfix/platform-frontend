import * as React from "react";
import { compose } from "redux";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/ErrorBoundaryLayoutAuthorized";
import { WalletRouter } from "./Router";

export const WalletComponent: React.SFC = () => (
  <LayoutAuthorized>
    <WalletRouter />
  </LayoutAuthorized>
);

export const Wallet = compose<React.SFC>(createErrorBoundary(ErrorBoundaryLayoutAuthorized))(
  WalletComponent,
);
