import { ECurrency } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ITxData } from "../../../../lib/web3/types";
import { makeEthereumAddressChecksummed } from "../../../../modules/web3/utils";
import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { UnlockFundsSummaryComponent } from "./Summary.unsafe";

const txData: ITxData = {
  to: makeEthereumAddressChecksummed("0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"),
  value: "5500000000000000000",
  gas: "12000",
  gasPrice: "57000000000",
  from: makeEthereumAddressChecksummed("0x8e75544b848f0a32a1ab119e3916ec7138f3bed2"),
};

storiesOf("Unlock Wallet Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UnlockFundsSummaryComponent
      onAccept={action("Accept Summary")}
      txData={txData}
      additionalData={{
        currencyType: ECurrency.ETH,
        lockedWalletBalance: "5500000000000000000",
        lockedWalletUnlockDate: "120000000000000000",
        neumarksDue: "5500000000000000000",
      }}
    />
  ));
