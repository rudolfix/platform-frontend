import { Eur } from "@neufund/design-system";
import {
  EEtoState,
  etoModuleApi,
  InvalidETOStateError,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { ENumberInputFormat, ENumberOutputFormat } from "@neufund/shared-utils";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { FormatNumber } from "../../../../shared/formatters/FormatNumber";
import { InvestmentProgress } from "../../../shared/InvestmentProgress";
import { InvestmentProgressPercentage } from "../../InvestmentProgressPercentage";
import { InvestmentTarget } from "./InvestmentTarget";

import * as styles from "./InvestmentStatusWidget.module.scss";

enum EInvestmentStatusSize {
  NORMAL = styles.statsWrapperNormal,
  SMALL = styles.statsWrapperSmall,
}

interface IInvestmentStatsProps {
  eto: TEtoWithCompanyAndContractReadonly;
  size?: EInvestmentStatusSize;
}

const InvestmentStatusWidget: React.FunctionComponent<IInvestmentStatsProps> = ({
  eto,
  size = EInvestmentStatusSize.NORMAL,
}) => {
  if (!etoModuleApi.utils.isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const totalInvestors = eto.contract.totalInvestment.totalInvestors;
  return (
    <section className={cn(size)} data-test-id="investment-status-widget">
      <div className={styles.row}>
        <span className={styles.funded}>
          <InvestmentProgressPercentage eto={eto} />
        </span>
        <span>
          <FormattedMessage
            id="shared-component.eto-overview.investment-stats.total-investors"
            values={{
              totalInvestors: (
                <FormatNumber
                  data-test-id="investment-widget-investors-invested"
                  value={totalInvestors}
                  outputFormat={ENumberOutputFormat.INTEGER}
                  inputFormat={ENumberInputFormat.DECIMAL}
                />
              ),
            }}
          />
        </span>
      </div>
      <InvestmentProgress eto={eto} />
      <div className={styles.row}>
        <span>
          <FormattedMessage
            id="shared-component.eto-overview.investment-stats.total-amount-raised"
            values={{
              amountRaised: (
                <Eur
                  data-test-id="investment-widget-total-nEur-invested"
                  value={eto.contract.totalInvestment.totalEquivEur}
                />
              ),
            }}
          />
        </span>
        <InvestmentTarget eto={eto} />
      </div>
    </section>
  );
};

export { InvestmentStatusWidget, EInvestmentStatusSize };
