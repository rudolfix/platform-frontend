import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";
import { Container } from "reactstrap";

import { ITxData } from "../../../../lib/web3/types";
import { UserClaimSummaryComponent } from "./Summary";

const txData: ITxData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: "5500000000000000000",
  gas: "12000",
  gasPrice: "57000000000",
  from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
};

storiesOf("User Claim Summary", module).add("default", () => (
  <Container>
    <UserClaimSummaryComponent
      txData={txData}
      txCost={"123456"}
      onAccept={() => {}}
      etoData={
        {
          investorTicket: {
            equityTokenInt: new BigNumber(100),
            amountEth: new BigNumber(1),
            amountEurUlps: new BigNumber(40),
            equivEurUlps: new BigNumber(1),
            rewardNmkUlps: new BigNumber(1),
            sharesInt: new BigNumber(1),
            tokenPrice: new BigNumber(1),
            neuRate: new BigNumber(1),
            claimedOrRefunded: true,
            usedLockedAccount: true,
          },
        } as any
      }
      downloadDocument={() => {}}
    />
  </Container>
));
