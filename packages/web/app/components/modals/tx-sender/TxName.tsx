import { ETxType } from "@neufund/shared-modules";
import { assertNever } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

interface IProps {
  type: ETxType;
}

/**
 * Generate transaction name used for title inside general TxPending and TxError modals
 */
const TxName: React.FunctionComponent<IProps> = ({ type }) => {
  switch (type) {
    case ETxType.WITHDRAW:
      return <FormattedMessage id="withdraw-flow.name" />;
    case ETxType.TRANSFER_TOKENS:
      return <FormattedMessage id="token-transfer-flow.name" />;
    case ETxType.INVESTOR_ACCEPT_PAYOUT:
      return <FormattedMessage id="investor-payout.accept.name" />;
    case ETxType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <FormattedMessage id="investor-payout.redistribute.name" />;
    case ETxType.USER_CLAIM:
      return <FormattedMessage id="modals.tx-sender.user-claim.title" />;
    case ETxType.UNLOCK_FUNDS:
      return <FormattedMessage id="unlock-funds-flow.title" />;
    case ETxType.ETO_SET_DATE:
      return <FormattedMessage id="eto.settings.eto-start-date.title" />;
    case ETxType.INVEST:
      return <FormattedMessage id="investment-flow.title" />;
    case ETxType.NEUR_REDEEM:
      return <FormattedMessage id="bank-transfer.redeem.title" />;
    case ETxType.SIGN_INVESTMENT_AGREEMENT:
      return <FormattedMessage id="investment-agreement.title" />;
    case ETxType.UPGRADE:
      return <FormattedMessage id="upgrade-flow.title" />;
    case ETxType.INVESTOR_REFUND:
      return <FormattedMessage id="user-refund-flow.title" />;
    case ETxType.NOMINEE_THA_SIGN:
      return <FormattedMessage id="nominee-sign-tha.title" />;
    case ETxType.NOMINEE_RAAA_SIGN:
      return <FormattedMessage id="nominee-sign-raaa.title" />;
    case ETxType.NOMINEE_ISHA_SIGN:
      return <FormattedMessage id="nominee-sign-isha.title" />;
    case ETxType.SHAREHOLDER_RESOLUTIONS_VOTE_SETUP:
      return <FormattedMessage id="shareholder-resolution-voting-setup.title" />;
    case ETxType.SHAREHOLDER_RESOLUTIONS_VOTE:
      return <FormattedMessage id="shareholder-resolution-voting.title" />;
    case ETxType.EXECUTE_RESOLUTION:
      return <FormattedMessage id="governance.publish-update" />;
    default:
      return assertNever(type);
  }
};

export { TxName };
