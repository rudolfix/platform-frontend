import { storiesOf } from "@storybook/react";
import * as React from "react";

import { IGasState } from "../../../../modules/gas/reducer";
import { WithdrawComponent } from "./Withdraw";
import { IcbmWalletBalanceComponent } from "./IcbmWalletBalanceModal";

export const dummyEthereumAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359";

const gas: IGasState = {
  loading: false,
  gasPrice: {
    fast: "0",
    fastest: "0",
    safeLow: "0",
    standard: "23000000000",
  },
};

storiesOf("ICBMWalletModalComponant", module)
  .add("Transaction Dialogue Box - Missing Verifications", () => (
    <IcbmWalletBalanceComponent
      isOpen={true}
      isVerificationFullyDone={false}
      lockedWalletConnected={false}
      onCancel={() => {}}
      onGotoWallet={() => {}}
      ethAddress={dummyEthereumAddress}
      isLoading={false}
      neumarksDue="0.0"
      etherBalance="1.1"
    />
  ))
  .add("Transaction Dialogue Box - With All verifications", () => (
    <IcbmWalletBalanceComponent
      isOpen={true}
      isVerificationFullyDone={true}
      lockedWalletConnected={false}
      onCancel={() => {}}
      onGotoWallet={() => {}}
      ethAddress={dummyEthereumAddress}
      isLoading={false}
      neumarksDue="0.0"
      etherBalance="1.1"
    />
  ));
