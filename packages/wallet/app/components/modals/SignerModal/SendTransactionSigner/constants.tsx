import { ETxType } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EIconType } from "components/shared/Icon";

const TxNames: Record<ETxType, React.ReactNode> = {
  [ETxType.WITHDRAW]: <FormattedMessage id="wallet.send-tx-signer.tx-name.withdraw" />,
  [ETxType.TRANSFER_TOKENS]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.transfer-tokens" />
  ),
  [ETxType.INVESTOR_ACCEPT_PAYOUT]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.accept-payout" />
  ),
  [ETxType.USER_CLAIM]: <FormattedMessage id="wallet.send-tx-signer.tx-name.user-claim" />,
  [ETxType.UNLOCK_FUNDS]: <FormattedMessage id="wallet.send-tx-signer.tx-name.unlock-funds" />,
  [ETxType.ETO_SET_DATE]: <FormattedMessage id="wallet.send-tx-signer.tx-name.eto-start-date" />,
  [ETxType.INVEST]: <FormattedMessage id="wallet.send-tx-signer.tx-name.invest" />,
  [ETxType.NEUR_REDEEM]: <FormattedMessage id="wallet.send-tx-signer.tx-name.nur-redeem" />,
  [ETxType.SIGN_INVESTMENT_AGREEMENT]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.sign-investment-agreement" />
  ),
  [ETxType.UPGRADE]: <FormattedMessage id="wallet.send-tx-signer.tx-name.upgrade" />,
  [ETxType.INVESTOR_REDISTRIBUTE_PAYOUT]: <FormattedMessage id="Unlock Funds Transaction" />,
  [ETxType.INVESTOR_REFUND]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.investor-refund" />
  ),
  [ETxType.NOMINEE_THA_SIGN]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.nominee-tha-sign" />
  ),
  [ETxType.NOMINEE_RAAA_SIGN]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.nominee-raa-sign" />
  ),
  [ETxType.NOMINEE_ISHA_SIGN]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.nominee-isha-sign" />
  ),
  [ETxType.SHAREHOLDER_RESOLUTIONS_VOTE]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.shareholder-resolution-vote" />
  ),
  [ETxType.EXECUTE_RESOLUTION]: (
    <FormattedMessage id="wallet.send-tx-signer.tx-name.execute-resolution" />
  ),
};

// TODO replace when icons are ready
const TxIcons: Record<ETxType, EIconType> = {
  [ETxType.WITHDRAW]: EIconType.BACKUP,
  [ETxType.TRANSFER_TOKENS]: EIconType.BACKUP,
  [ETxType.INVESTOR_ACCEPT_PAYOUT]: EIconType.BACKUP,
  [ETxType.USER_CLAIM]: EIconType.BACKUP,
  [ETxType.UNLOCK_FUNDS]: EIconType.BACKUP,
  [ETxType.ETO_SET_DATE]: EIconType.BACKUP,
  [ETxType.INVEST]: EIconType.BACKUP,
  [ETxType.NEUR_REDEEM]: EIconType.BACKUP,
  [ETxType.SIGN_INVESTMENT_AGREEMENT]: EIconType.BACKUP,
  [ETxType.UPGRADE]: EIconType.BACKUP,
  [ETxType.INVESTOR_REDISTRIBUTE_PAYOUT]: EIconType.BACKUP,
  [ETxType.INVESTOR_REFUND]: EIconType.BACKUP,
  [ETxType.NOMINEE_THA_SIGN]: EIconType.BACKUP,
  [ETxType.NOMINEE_RAAA_SIGN]: EIconType.BACKUP,
  [ETxType.NOMINEE_ISHA_SIGN]: EIconType.BACKUP,
  [ETxType.SHAREHOLDER_RESOLUTIONS_VOTE]: EIconType.BACKUP,
  [ETxType.EXECUTE_RESOLUTION]: EIconType.BACKUP,
};

export { TxIcons, TxNames };
