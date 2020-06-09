import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId } from "../../types";
import { AcceptTosModal } from "../modals/accept-tos-modal/AcceptTosModal";
import { BankTransferFlowModal } from "../modals/bank-transfer-flow/BankTransferFlow";
import { DepositEthModal } from "../modals/deposit-eth/DepositEthModal";
import { DownloadTokenAgreementModal } from "../modals/download-token-agreements-modal/DownloadTokenAgreementModal";
import { IcbmWalletBalanceModal } from "../modals/icbm-wallet-balance-modal/IcbmWalletBalanceModal";
import { TxSenderModal } from "../modals/tx-sender/TxSender/TxSender";

import * as styles from "./LayoutContainer.module.scss";

type TExternalProps = {
  userIsAuthorized: boolean;
};

/**
 * Global components for authorized state that should be always available in the three
 */
const LayoutAuthorizedHoistedComponent: React.FunctionComponent = () => (
  <>
    <AcceptTosModal />
    <DepositEthModal />
    <TxSenderModal />
    <IcbmWalletBalanceModal />
    <BankTransferFlowModal />
    <DownloadTokenAgreementModal />
  </>
);

const LayoutContainer: React.FunctionComponent<TExternalProps & TDataTestId & CommonHtmlProps> = ({
  children,
  "data-test-id": dataTestId,
  className,
  userIsAuthorized,
}) => (
  <>
    {userIsAuthorized && <LayoutAuthorizedHoistedComponent />}
    <div className={cn(styles.layout, className)} data-test-id={dataTestId}>
      {children}
    </div>
  </>
);

export { LayoutContainer };
