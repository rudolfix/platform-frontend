import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { PercentageIndicatorBar } from "../../../shared/PercentageIndicatorBar";

import * as styles from "./InvestWidget.module.scss";

export interface IInvestWidgetProps {
  investorsBacked: number;
  tokensGoal: number;
  raisedTokens: number;
  etoId: string;
}

export interface IInvestWidgetDispatchProps {
  startInvestmentFlow: () => void;
}

export type TInvestWidgetProps = IInvestWidgetProps & IInvestWidgetDispatchProps;

const InvestWidgetComponent: React.SFC<TInvestWidgetProps> = ({
  investorsBacked,
  tokensGoal,
  raisedTokens,
  startInvestmentFlow,
}) => {
  return (
    <div className={styles.investWidget}>
      <div className={styles.header}>
        <div>
          <div>{raisedTokens} nEUR</div>
        </div>
        <div>
          {`${investorsBacked} `}
          <FormattedMessage id="shared-component.eto-overview.investors" />
        </div>
      </div>
      <PercentageIndicatorBar
        theme="green"
        layout="narrow"
        className="my-2"
        fraction={raisedTokens / tokensGoal}
      />
      <div className={styles.investNowButton}>
        <Button onClick={startInvestmentFlow}>
          <FormattedMessage id="shared-component.eto-overview.invest-now" />
        </Button>
      </div>
    </div>
  );
};

const InvestWidget = appConnect<{}, IInvestWidgetDispatchProps, IInvestWidgetProps>({
  dispatchToProps: (d, p) => ({
    startInvestmentFlow: () => d(actions.investmentFlow.investmentStart(p.etoId)),
  }),
})(InvestWidgetComponent);

export { InvestWidget };
