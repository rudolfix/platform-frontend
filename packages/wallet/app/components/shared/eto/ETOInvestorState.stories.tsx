import {
  EEtoState,
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContract,
} from "@neufund/shared-modules";
import { toDeepPartialMock } from "@neufund/shared-utils/tests";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";

import { ETOInvestorState } from "./ETOInvestorState";

const etoComingSoon = toDeepPartialMock<TEtoWithCompanyAndContract>({
  state: EEtoState.PREVIEW,
});

const etoOnChainCampaigning = toDeepPartialMock<TEtoWithCompanyAndContract>({
  subState: undefined,
  state: EEtoState.ON_CHAIN,
  contract: {
    timedState: EETOStateOnChain.Setup,
  },
});

const etoWhitelisting = toDeepPartialMock<TEtoWithCompanyAndContract>({
  state: EEtoState.PROSPECTUS_APPROVED,
  subState: EEtoSubState.WHITELISTING,
  contract: undefined,
});

const etoOnChainRefund = toDeepPartialMock<TEtoWithCompanyAndContract>({
  subState: undefined,
  state: EEtoState.ON_CHAIN,
  contract: {
    timedState: EETOStateOnChain.Refund,
  },
});

storiesOf("Molecules|ETOInvestorState", module)
  .add("coming soon state", () => <ETOInvestorState eto={etoComingSoon} />)
  .add("campaigning", () => <ETOInvestorState eto={etoOnChainCampaigning} />)
  .add("whitelisting", () => <ETOInvestorState eto={etoWhitelisting} />)
  .add("refund", () => <ETOInvestorState eto={etoOnChainRefund} />);
