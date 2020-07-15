import { EButtonLayout, EIconPosition } from "@neufund/design-system";
import { ITokenDisbursal } from "@neufund/shared-modules";
import { ENumberInputFormat, ENumberOutputFormat, nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../appRoutes";
import { ButtonLink } from "../../../shared/buttons";
import { ETheme } from "../../../shared/formatters/Money";
import { MoneyWithLessThan } from "../../../shared/formatters/MoneyWithLessThan";

import arrowRight from "../../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./PayoutWidget.module.scss";

type TIncomingPayoutAvailableProps = {
  tokensDisbursal: readonly ITokenDisbursal[] | undefined;
};

export const IncomingPayoutAvailable: React.FunctionComponent<TIncomingPayoutAvailableProps> = props => {
  const tokensDisbursal = nonNullable(props.tokensDisbursal);

  return (
    <div className={styles.main} data-test-id="my-portfolio-widget-incoming-payout-available">
      <h3 className={styles.header} data-test-id="incoming-payout-done">
        <FormattedMessage id="dashboard.incoming-payout-widget.incoming-payout-done" />
      </h3>
      <div>
        <>
          {tokensDisbursal
            .map(t => (
              <MoneyWithLessThan
                value={t.amountToBeClaimed}
                valueType={t.token}
                inputFormat={ENumberInputFormat.ULPS}
                outputFormat={ENumberOutputFormat.FULL}
                key={t.token}
                theme={ETheme.GREEN}
                className={styles.incomingValue}
              />
            ))
            .reduce<React.ReactNode[]>(
              (acc, component) =>
                acc.length === 0
                  ? acc.concat(component)
                  : acc.concat(
                      <span className={styles.incomingValue} key={"&"}>
                        {" "}
                        &{" "}
                      </span>,
                      component,
                    ),
              [],
            )}
        </>
      </div>
      <ButtonLink
        data-test-id="incoming-payout-go-to-portfolio"
        to={appRoutes.portfolio}
        layout={EButtonLayout.LINK}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
      >
        <FormattedMessage id="dashboard.incoming-payout-widget.go-to-portfolio" />
      </ButtonLink>
    </div>
  );
};
