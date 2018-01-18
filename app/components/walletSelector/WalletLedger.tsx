import * as React from "react";

import { WalletLedgerChooser } from "./WalletLedgerChooser";
import { WalletLedgerInitComponent } from "./WalletLedgerInitComponent";

export const WalletLedger = () => {
  // It's just mock-up
  const check = true;

  if (check) {
    return <WalletLedgerChooser />;
  } else {
    return <WalletLedgerInitComponent />;
  }
};
