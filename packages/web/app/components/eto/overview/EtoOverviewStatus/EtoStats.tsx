import { EquityTokenPriceEuro, WholeEur } from "@neufund/design-system";
import {
  calcCapFraction,
  etoModuleApi,
  investorPortfolioModuleApi,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { ENumberFormat, ENumberInputFormat, ENumberOutputFormat } from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { appConnect } from "../../../../store";
import { MoneyRange } from "../../../shared/formatters/MoneyRange";
import { ToBeAnnounced, ToBeAnnouncedTooltip } from "../../shared/ToBeAnnouncedTooltip";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IStateProps {
  tokenPrice: number | undefined;
  showWhitelistDiscount: boolean;
  showPublicDiscount: boolean;
  computedMaxCapPercent: number;
  computedMinCapPercent: number;
}

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

const EtoStatsLayout: React.FunctionComponent<IStateProps & IExternalProps> = ({
  eto,
  tokenPrice,
  showWhitelistDiscount,
  showPublicDiscount,
  computedMaxCapPercent,
  computedMinCapPercent,
}) => {
  const shouldShowComputedCap = eto.newSharesToIssue && eto.minimumNewSharesToIssue;
  const eurMinTarget = etoModuleApi.utils.getEtoEurMinTarget(eto);

  return (
    <div className={cn(styles.etoStatsWrapper, styles.groupWrapper)}>
      <div className={styles.group}>
        <span className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview-status.key-investment-terms" />
          {":"}
        </span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
        </span>
        <span className={styles.value}>
          <WholeEur
            value={eto.preMoneyValuationEur ? eto.preMoneyValuationEur.toString() : undefined}
            defaultValue={<ToBeAnnouncedTooltip />}
            data-test-id="eto-overview.stats.pre-money-valuation"
          />
        </span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview-status.target-investment-amount" />
        </span>
        <span className={styles.value}>
          <WholeEur
            value={eurMinTarget}
            defaultValue={<ToBeAnnounced />}
            data-test-id="eto-overview.stats.target-investment-amount"
          />
        </span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
        </span>
        <span className={styles.value}>
          <MoneyRange
            valueFrom={shouldShowComputedCap ? computedMinCapPercent.toString() : ""}
            valueUpto={shouldShowComputedCap ? computedMaxCapPercent.toString() : ""}
            inputFormat={ENumberInputFormat.DECIMAL}
            outputFormat={ENumberOutputFormat.FULL}
            valueType={ENumberFormat.PERCENTAGE}
            defaultValue={<ToBeAnnounced />}
            data-test-id="eto-overview.stats.new-shares-generated"
          />
        </span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
        </span>
        <span className={styles.value}>
          <EquityTokenPriceEuro
            value={tokenPrice ? tokenPrice.toString() : undefined}
            defaultValue={<ToBeAnnounced />}
            data-test-id="eto-overview.stats.equity-token-price"
          />
          {showWhitelistDiscount && (
            <span data-test-id="eto-overview.stats.equity-token-price.public-discount">
              {" ("}
              <FormattedMessage
                id="shared-component.eto-overview-status.included-discount-percentage"
                values={{ percentage: eto.whitelistDiscountFraction! * 100 }}
              />
              {")"}
            </span>
          )}
          {showPublicDiscount && (
            <span data-test-id="eto-overview.stats.equity-token-price-whitelist-discount">
              {" ("}
              <FormattedMessage
                id="shared-component.eto-overview-status.included-discount-percentage"
                values={{ percentage: eto.publicDiscountFraction! * 100 }}
              />
              {")"}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export const EtoStats = compose<IStateProps & IExternalProps, IExternalProps>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const etoData = props.eto;

      const showWhitelistDiscount = investorPortfolioModuleApi.selectors.selectShouldShowWhitelistDiscount(
        state,
        etoData,
      );
      const showPublicDiscount = investorPortfolioModuleApi.selectors.selectShouldShowPublicDiscount(
        state,
        etoData,
      );

      let tokenPrice;
      if (etoData.investmentCalculatedValues) {
        tokenPrice = etoData.investmentCalculatedValues.sharePrice;
        if (showWhitelistDiscount) {
          tokenPrice = etoData.investmentCalculatedValues.discountedSharePrice;
        }
        if (showPublicDiscount) {
          tokenPrice = etoData.investmentCalculatedValues.publicSharePrice;
        }
        tokenPrice = tokenPrice / etoData.equityTokensPerShare;
      }

      return {
        tokenPrice,
        showWhitelistDiscount,
        showPublicDiscount,
        ...calcCapFraction(props.eto),
      };
    },
  }),
)(EtoStatsLayout);
