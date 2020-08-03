import { WholeEur } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Message } from "../Message";

type TWhitelistingLimitSuspended = {
  pledgedAmount: number;
  investorsCount: number;
  isPledgedByUser: boolean;
};

export const WhitelistingSuspended: React.FunctionComponent<TWhitelistingLimitSuspended> = ({
  isPledgedByUser,
  pledgedAmount,
  investorsCount,
}) => (
  <Message
    data-test-id="eto-overview-status-whitelisting-suspended"
    title={
      isPledgedByUser ? (
        <FormattedMessage id="shared-component.eto-overview.whitelist.suspended-signed" />
      ) : (
        <FormattedMessage id="shared-component.eto-overview.whitelist.suspended" />
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
