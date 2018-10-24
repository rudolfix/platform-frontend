import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { InvestmentSelectionComponent } from "./Investment";
import { wallets } from "./InvestmentTypeSelector.stories";

const Investment = injectIntlHelpers(InvestmentSelectionComponent);

storiesOf("Investment/Modal", module).add("default", () => (
  <Container>
    <Investment
      wallets={wallets}
      changeEthValue={() => {}}
      changeEuroValue={() => {}}
      changeInvestmentType={() => {}}
      equityTokenCount={"1234"}
      errorState={EInvestmentErrorState.NotEnoughEtherForGas}
      ethValue={"123412341234123412341234"}
      // tslint:disable-next-line:no-object-literal-type-assertion
      eto={{ etoId: 11234 } as any}
      euroValue={"123412341234123412341234"}
      gasCostEth={"123412341234123412341234"}
      gasCostEuro={"123412341234123412341234"}
      etherPriceEur={"123412341234123412341234"}
      investEntireBalance={() => {}}
      investmentType={EInvestmentType.InvestmentWallet}
      isWalletBalanceKnown={true}
      minTicketEth={"12341234123412341234"}
      minTicketEur={1234}
      readyToInvest={false}
      investNow={() => {}}
      showTokens={true}
      totalCostEth={"123412341234123412341234"}
      totalCostEur={"123412341234123412341234"}
      sendTransaction={() => {}}
      showBankTransferDetails={() => {}}
    />
  </Container>
));
