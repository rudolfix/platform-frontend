import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as MockDate from "mockdate";
import * as React from "react";

import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/types";
import { EtoMaxCapExceededComponent } from "./EtoMaxCapExceeded";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
  companyId: "asdf",
  previewCode: "1234",
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
  maxPledges: 500,
  maxTicketEur: 10000000,
  minTicketEur: 100,
  minimumNewSharesToIssue: 1000,
  newSharesToIssue: 3452,
  newSharesToIssueInWhitelist: 1534,
  company: {},
  contract: {
    timedState: EETOStateOnChain.Whitelist,
    totalInvestment: {
      totalInvestors: new BigNumber("123"),
      totalTokensInt: new BigNumber("34520"),
      totalEquivEurUlps: new BigNumber(1234),
    },
  },
} as TEtoWithCompanyAndContract;

class EtoMaxCapExceededComponentWithMockedDate extends React.Component<any> {
  constructor(props: any) {
    super(props);

    MockDate.set("1/1/2000");
  }

  render(): React.ReactNode {
    return (
      <EtoMaxCapExceededComponent
        isPreEto={true}
        eto={eto}
        etherPriceEur={"100"}
        isWaitingForNextStateToStart={true}
        nextStateStartDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
      />
    );
  }

  componentWillUnmount(): void {
    MockDate.reset();
  }
}

storiesOf("ETO/MaxCapExceededWidget", module)
  .add("pre-eto", () => <EtoMaxCapExceededComponentWithMockedDate />)
  .add("public", () => (
    <EtoMaxCapExceededComponent
      isPreEto={false}
      eto={eto}
      etherPriceEur={"100"}
      isWaitingForNextStateToStart={false}
      nextStateStartDate={new Date("+1 day")}
    />
  ));
