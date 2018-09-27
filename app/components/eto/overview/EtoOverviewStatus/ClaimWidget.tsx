import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../shared/buttons";
import { SuccessTick } from "../../../shared/SuccessTick";

import * as styles from "./ClaimWidget.module.scss";

export interface IClaimWidget {
  tokenName: string;
  numberOfInvestors: number | undefined;
  raisedAmount: string | number | undefined;
  isPayout: boolean;
}

const ClaimWidget: React.SFC<IClaimWidget> = ({
  tokenName,
  numberOfInvestors,
  raisedAmount,
  isPayout,
}) => (
  <div className={styles.claimWidget}>
    <SuccessTick />
    <div className={styles.message}>
      <FormattedMessage id="shared-component.eto-overview.success" />
      <div>
        <FormattedMessage id="shared-component.eto-overview.success.equivalent-to" />
        {` €${raisedAmount} `}
        <FormattedMessage id="shared-component.eto-overview.success.raised-by" />
        {` ${numberOfInvestors} `}
        <FormattedMessage id="shared-component.eto-overview.success.investors" />
      </div>
    </div>
    {isPayout && (
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-token" /> {tokenName}
      </Button>
    )}
  </div>
);

export { ClaimWidget };
