import { Button, CheckboxBase } from "@neufund/design-system";
import { ETxType } from "@neufund/shared-modules";
import { EthereumAddressWithChecksum, selectUnits } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TAcceptPayoutAdditionalData } from "../../../../modules/tx/transactions/payout/accept/types";
import { selectEthereumAddress } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { commitmentStatusLink } from "../../../appRouteUtils";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { ExternalLink } from "../../../shared/links";
import { AcceptTransactionDetails } from "./AcceptTransactionDetails";

import * as styles from "./AcceptSummary.module.scss";

interface IStateProps {
  additionalData: TAcceptPayoutAdditionalData;
  walletAddress: EthereumAddressWithChecksum;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = IStateProps & IDispatchProps;

const InvestorAcceptPayoutSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  walletAddress,
  additionalData,
  onAccept,
}) => {
  const [warningAccepted, setWarningAccepted] = React.useState(
    !additionalData.payoutLowerThanMinimum,
  );

  return (
    <div className={styles.container}>
      <Heading size={EHeadingSize.SMALL} level={4}>
        <FormattedMessage id="investor-payout.accept.summary.title" />
      </Heading>
      <p>
        {additionalData.tokensDisbursals.length === 1 ? (
          <FormattedMessage
            id="investor-payout.accept.summary.single.description"
            values={{ token: selectUnits(additionalData.tokensDisbursals[0].token) }}
          />
        ) : (
          <FormattedMessage id="investor-payout.accept.summary.combined.description" />
        )}
      </p>
      <AcceptTransactionDetails additionalData={additionalData} />
      <ExternalLink className={styles.thaLink} href={commitmentStatusLink(walletAddress)}>
        <FormattedMessage id="investor-payout.summary.neu-tokenholder-agreement" />
      </ExternalLink>
      {additionalData.payoutLowerThanMinimum && (
        <div className={styles.highGasCostWarning}>
          <CheckboxBase
            name="high-gas-cost-warning-checkbox"
            checked={warningAccepted}
            onChange={() => setWarningAccepted(!warningAccepted)}
          />
          <p className={styles.highGasCostWarningText}>
            <FormattedMessage id="investor-payout.accept.summary.high-gas-cost-warning" />
          </p>
        </div>
      )}
      <Button
        onClick={onAccept}
        disabled={!warningAccepted}
        data-test-id="investor-payout.accept-summary.accept"
      >
        <FormattedMessage id="investor-payout.accept.summary.accept" />
      </Button>
    </div>
  );
};

const InvestorAcceptPayoutSummary = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: state => ({
    walletAddress: selectEthereumAddress(state),
    additionalData: selectTxAdditionalData<ETxType.INVESTOR_ACCEPT_PAYOUT>(state)!,
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(InvestorAcceptPayoutSummaryLayout);

export { InvestorAcceptPayoutSummary, InvestorAcceptPayoutSummaryLayout };
