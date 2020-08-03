import { WholeEur } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Message } from "../Message";

type TWhitelistingLimitReached = {
  pledgedAmount: number;
  investorsCount: number;
  isPledgedByUser: boolean;
};

export const WhitelistingLimitReached: React.FunctionComponent<TWhitelistingLimitReached> = ({
  pledgedAmount,
  investorsCount,
  isPledgedByUser,
}) => (
  <Message
    data-test-id="eto-overview-status-whitelisting-limit-reached"
    title={
      isPledgedByUser ? (
        <FormattedMessage id="shared-component.eto-overview.whitelist.success-signed" />
      ) : (
        <FormattedMessage id="shared-component.eto-overview.whitelist.success" />
      )
    }
    summary={
      <FormattedMessage
        id="shared-component.eto-overview.whitelist.success.summary"
        values={{
          totalAmount: <WholeEur value={pledgedAmount ? pledgedAmount.toString() : undefined} />,
          totalInvestors: investorsCount,
        }}
      />
    }
  />
);
