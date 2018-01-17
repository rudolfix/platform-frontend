import * as React from "react";

import { WalletLedgerChooserComponent } from "./WalletLedgerChooserComponent";
import { WalletLedgerInitComponent } from "./WalletLedgerInitComponent";

export const WalletLedger = () => {
  // It's just mock-up
  const check = true;

  if (check) {
    return <WalletLedgerChooserComponent />;
  } else {
    return <WalletLedgerInitComponent />;
  }
};
