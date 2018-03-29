import * as React from "react";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { WalletRouter } from "./Router";

export const Wallet: React.SFC = () => (
  <LayoutAuthorized>
    <WalletRouter />
  </LayoutAuthorized>
);
