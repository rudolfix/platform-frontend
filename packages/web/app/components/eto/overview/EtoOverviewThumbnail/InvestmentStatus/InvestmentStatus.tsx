import { Eur } from "@neufund/design-system";
import {
  EETOStateOnChain,
  etoModuleApi,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { ENumberInputFormat, ENumberOutputFormat } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { appConnect } from "../../../../../store";
import { FormatNumber } from "../../../../shared/formatters/FormatNumber";
import { InvestmentProgress } from "../../../shared/InvestmentProgress";

import * as styles from "./InvestmentStatus.module.scss";

export interface IInvestmentWidgetProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

export interface IInvestmentWidgetStateProps {
  nextStateDate: Date | undefined;
}

export type TInvestWidgetProps = IInvestmentWidgetProps & IInvestmentWidgetStateProps;

const InvestmentLayout: React.FunctionComponent<TInvestWidgetProps> = ({ eto }) => {
  const totalInvestors = eto.contract!.totalInvestment.totalInvestors;

  return (
    <div className={styles.investmentWidget}>
      <div className={styles.header}>
        {eto.contract!.timedState !== EETOStateOnChain.Payout && (
          <div>
            {"≈"}
            <Eur value={eto.contract!.totalInvestment.totalEquivEur} />
          </div>
        )}
        {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" && (
          <div data-test-id={`eto-overview-${eto.etoId}-investors-count`}>
            <FormattedMessage
              id="shared-component.eto-overview.investors"
              values={{
                totalInvestors,
                totalInvestorsAsString: (
                  <FormatNumber
                    value={totalInvestors}
                    outputFormat={ENumberOutputFormat.INTEGER}
                    inputFormat={ENumberInputFormat.DECIMAL}
                  />
                ),
              }}
            />
          </div>
        )}
      </div>
      <InvestmentProgress eto={eto} />
    </div>
  );
};

const InvestmentStatus = compose<TInvestWidgetProps, IInvestmentWidgetProps>(
  appConnect<IInvestmentWidgetStateProps, {}, IInvestmentWidgetProps>({
    stateToProps: (state, props) => ({
      nextStateDate: etoModuleApi.selectors.selectEtoOnChainNextStateStartDate(
        state,
        props.eto.previewCode,
      ),
    }),
  }),
)(InvestmentLayout);

export { InvestmentStatus, InvestmentLayout };
