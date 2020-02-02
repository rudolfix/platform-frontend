import { nonNullable } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ITokenDisbursal } from "../../../../modules/investor-portfolio/types";
import { ButtonInline } from "../../../shared/buttons/ButtonInline";
import { ETheme, Money } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../shared/formatters/utils";
import { InlineIcon } from "../../../shared/icons/InlineIcon";
import { TDispatchProps } from "./MyNeuWidget";

import warningIcon from "../../../../assets/img/inline_icons/error.svg";
import styles from "./MyNeuWidget.module.scss";

type TAvailablePayoutProps = {
  tokensDisbursalEurEquiv: string;
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
} & TDispatchProps;

export const MyNeuWidgetAvailablePayout: React.FunctionComponent<TAvailablePayoutProps> = ({
  tokensDisbursalEurEquiv,
  acceptCombinedPayout,
  tokensDisbursal,
}) => (
  <section className={styles.payoutContainer}>
    <InlineIcon svgIcon={warningIcon} className={styles.warningIcon} />
    <div>
      <FormattedMessage
        id="dashboard.my-neu-widget.available-payout"
        values={{
          amount: (
            <Money
              value={tokensDisbursalEurEquiv}
              inputFormat={ENumberInputFormat.ULPS}
              valueType={ECurrency.EUR}
              outputFormat={ENumberOutputFormat.FULL}
              theme={ETheme.GREEN}
              className={styles.payoutAmount}
            />
          ),
        }}
      />
      <ButtonInline
        onClick={() => acceptCombinedPayout(nonNullable(tokensDisbursal))}
        className={styles.buttonPayout}
      >
        <FormattedMessage id="dashboard.my-neu-widget.available-payout-claim" />
      </ButtonInline>
    </div>
  </section>
);
