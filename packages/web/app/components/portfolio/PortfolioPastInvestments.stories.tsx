import { convertFromUlps } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { testEto } from "../../../test/fixtures";
import { EETOStateOnChain } from "../../modules/eto/types";
import { IInvestorTicket, TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { LoadingIndicator } from "../shared/loading-indicator";
import { WarningAlert } from "../shared/WarningAlert";
import {
  PastInvestmentsContainer,
  PastInvestmentsNoInvestments,
  PortfolioPastInvestmentsLayout,
} from "./PortfolioPastInvestments";

const eto = {
  ...testEto,
  contract: {
    ...testEto.contract,
    timedState: EETOStateOnChain.Payout,
  },
  investorTicket: {
    equivEur: convertFromUlps("738464183130318387747").toString(),
    rewardNmkUlps: "0",
    equityTokenInt: "2280",
    shares: convertFromUlps("228000000000000000").toString(),
    tokenPrice: convertFromUlps("323887799618560696").toString(),
    neuRate: "0",
    amountEth: "4716210000000000000",
    amountEurUlps: "0",
    claimedOrRefunded: true,
    usedLockedAccount: true,
  } as IInvestorTicket,
} as TETOWithInvestorTicket;

const pastInvestments = [eto];

storiesOf("Portfolio/PortfolioPastInvestments", module)
  .add("default", () => (
    <PastInvestmentsContainer>
      <PortfolioPastInvestmentsLayout
        pastInvestments={pastInvestments}
        hasError={false}
        isRetailEto={true}
        showDownloadAgreementModal={action("SHOW_AGREEMENTS")}
      />
    </PastInvestmentsContainer>
  ))
  .add("without past investments", () => (
    <PastInvestmentsContainer>
      <PastInvestmentsNoInvestments />
    </PastInvestmentsContainer>
  ))
  .add("loading", () => (
    <PastInvestmentsContainer>
      <LoadingIndicator className="m-auto" />
    </PastInvestmentsContainer>
  ))
  .add("with error", () => (
    <PastInvestmentsContainer>
      <WarningAlert data-test-id="my-neu-widget-error" className="m-auto">
        <FormattedMessage id="common.error" values={{ separator: " " }} />
      </WarningAlert>
    </PastInvestmentsContainer>
  ));
