import { isZero } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../config/externalRoutes";
import { TDataTestId } from "../../../../types";
import { Counter } from "../../../shared/Counter";
import { ETheme, Money } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../shared/formatters/utils";

import * as styles from "./PayoutWidget.module.scss";

type TExternalProps = {
  etherTokenIncomingPayout: string;
  euroTokenIncomingPayout: string;
  loadPayoutsData: () => void;
  endDate: Date;
};

type TIncomingPayoutPendingBaseProps = {
  etherTokenIncomingPayout: string;
  euroTokenIncomingPayout: string;
} & TDataTestId;

export const IncomingPayoutPendingBase: React.FunctionComponent<TIncomingPayoutPendingBaseProps> = ({
  euroTokenIncomingPayout,
  etherTokenIncomingPayout,
  ["data-test-id"]: dataTestId,
  children,
}) => (
  <div className={styles.main} data-test-id={dataTestId}>
    <h3 className={styles.header}>
      <FormattedMessage id="dashboard.incoming-payout-widget.incoming-payout" />
    </h3>
    {children}
    <div>
      {!isZero(euroTokenIncomingPayout) && (
        <Money
          value={euroTokenIncomingPayout}
          inputFormat={ENumberInputFormat.ULPS}
          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          valueType={ECurrency.EUR_TOKEN}
          data-test-id="incoming-payout-euro-token"
          className={styles.incomingValue}
          theme={ETheme.GREEN}
        />
      )}
      {!isZero(euroTokenIncomingPayout) && !isZero(etherTokenIncomingPayout) && (
        <span className={styles.incomingValue}> & </span>
      )}
      {!isZero(etherTokenIncomingPayout) && (
        <Money
          value={etherTokenIncomingPayout}
          inputFormat={ENumberInputFormat.ULPS}
          valueType={ECurrency.ETH}
          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          data-test-id="incoming-payout-ether-token"
          className={styles.incomingValue}
          theme={ETheme.GREEN}
        />
      )}
    </div>
    <p className={styles.statementText}>
      <FormattedMessage id="dashboard.incoming-payout-widget.wallet-statement" />
    </p>
    <p className={styles.statementText}>
      <FormattedHTMLMessage
        tagName="span"
        id="dashboard.incoming-payout-widget.read-more"
        values={{ href: externalRoutes.incomingPayoutBlogPost }}
      />
    </p>
  </div>
);

export const IncomingPayoutPendingLayout: React.FunctionComponent<TExternalProps> = ({
  endDate,
  loadPayoutsData,
  etherTokenIncomingPayout,
  euroTokenIncomingPayout,
}) => (
  <IncomingPayoutPendingBase
    data-test-id="my-portfolio-widget-incoming-payout-pending"
    etherTokenIncomingPayout={etherTokenIncomingPayout}
    euroTokenIncomingPayout={euroTokenIncomingPayout}
  >
    <Counter
      data-test-id="incoming-payout-counter"
      className={styles.counterWidget}
      endDate={endDate}
      onFinish={loadPayoutsData}
    />
  </IncomingPayoutPendingBase>
);
