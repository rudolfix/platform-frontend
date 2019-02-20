import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { CommonHtmlProps } from "../../../types";
import { isZero } from "../../../utils/Number.utils";
import { AccountBalance } from "../../shared/AccountBalance";
import { ECurrency } from "../../shared/Money";
import { VerifiedBankAccount } from "../VerifiedBankAccount";
import { WalletBalanceContainer } from "./WalletBalance";

import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

interface IUnlockedNEURWallet {
  onTopUP: () => void;
  onRedeem: () => void;
  neuroAmount: string;
  neuroEuroAmount: string;
}

export const UnlockedNEURWallet: React.FunctionComponent<IUnlockedNEURWallet & CommonHtmlProps> = ({
  onTopUP,
  onRedeem,
  neuroAmount,
  neuroEuroAmount,
  className,
}) => (
  <WalletBalanceContainer
    className={className}
    headerText={<FormattedMessage id="components.wallet.start.neur-wallet" />}
  >
    <p className={styles.message}>
      <FormattedHTMLMessage
        tagName="span"
        id="shared-component.neur-wallet-balance.explanation"
        values={{
          quintessenseHref: externalRoutes.quintessenseLanding,
        }}
      />
    </p>

    <VerifiedBankAccount />

    <section>
      <h4 className={styles.title}>
        <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
      </h4>

      <AccountBalance
        icon={neuroIcon}
        currency={ECurrency.EUR_TOKEN}
        currencyTotal={ECurrency.EUR}
        largeNumber={neuroAmount}
        value={neuroEuroAmount}
        data-test-id="wallet-balance.neur"
        actions={
          process.env.NEURO_WITHDRAW_ENABLED === "1"
            ? [
                {
                  name: <FormattedMessage id="components.wallet.start.neur-wallet.top-up" />,
                  onClick: onTopUP,
                },
                {
                  name: <FormattedMessage id="components.wallet.start.neur-wallet.redeem" />,
                  onClick: onRedeem,
                  disabled: isZero(neuroAmount),
                },
              ]
            : undefined
        }
      />
    </section>
  </WalletBalanceContainer>
);
