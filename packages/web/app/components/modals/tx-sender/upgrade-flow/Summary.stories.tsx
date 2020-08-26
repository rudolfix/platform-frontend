import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ITxData } from "../../../../lib/web3/types";
import { ETokenType } from "../../../../modules/tx/types";
import { makeEthereumAddressChecksummed } from "../../../../modules/web3/utils";
import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { UpgradeSummaryComponent } from "./Summary";

const txData: ITxData = {
  to: makeEthereumAddressChecksummed("0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"),
  value: "5500000000000000000",
  gas: "12000",
  gasPrice: "57000000000",
  from: makeEthereumAddressChecksummed("0x8e75544b848f0a32a1ab119e3916ec7138f3bed2"),
};

storiesOf("Upgrade Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UpgradeSummaryComponent
      txData={txData}
      onAccept={() => {}}
      downloadICBMAgreement={() => {}}
      additionalData={{ tokenType: ETokenType.ETHER }}
    />
  ));
