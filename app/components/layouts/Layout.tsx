import * as React from "react";
import { compose } from "recompose";

import { selectIsAuthorized } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { TDataTestId } from "../../types";
import { AcceptTosModal } from "../modals/accept-tos-modal/AcceptTosModal";
import { BankTransferFlowModal } from "../modals/bank-transfer-flow/BankTransferFlow";
import { DepositEthModal } from "../modals/DepositEthModal";
import { DownloadTokenAgreementModal } from "../modals/download-token-agreements-modal/DownloadTokenAgreementModal";
import { IcbmWalletBalanceModal } from "../modals/icbm-wallet-balance-modal/IcbmWalletBalanceModal";
import { TxSenderModal } from "../modals/tx-sender/TxSender";
import { NotificationWidget } from "../shared/notification-widget/NotificationWidget";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { HeaderAuthorized, HeaderUnauthorized } from "./header/Header";

import * as styles from "./Layout.module.scss";

interface IStateProps {
  userIsAuthorized: boolean;
}

interface ILayoutUnauthProps {
  hideHeaderCtaButtons: boolean;
}

interface IExternalProps {
  hideHeaderCtaButtons?: boolean;
}

export const LayoutUnauthorized: React.FunctionComponent<ILayoutUnauthProps> = ({
  children,
  hideHeaderCtaButtons,
}) => (
  <>
    <HeaderUnauthorized hideHeaderCtaButtons={hideHeaderCtaButtons} />
    <Content>{children}</Content>
    <Footer />
  </>
);

export const LayoutAuthorized: React.FunctionComponent = ({ children }) => (
  <>
    <HeaderAuthorized />
    <Content>
      <NotificationWidget className={styles.notification} />
      {children}
    </Content>
    <Footer />
    <AcceptTosModal />
    <DepositEthModal />
    <TxSenderModal />
    <IcbmWalletBalanceModal />
    <BankTransferFlowModal />
    <DownloadTokenAgreementModal />
  </>
);

export const LayoutComponent: React.FunctionComponent<
  IStateProps & TDataTestId & IExternalProps
> = ({ children, userIsAuthorized, hideHeaderCtaButtons = false, "data-test-id": dataTestId }) => (
  <div className={styles.layout} data-test-id={dataTestId}>
    {userIsAuthorized ? (
      <LayoutAuthorized>{children}</LayoutAuthorized>
    ) : (
      <LayoutUnauthorized hideHeaderCtaButtons={hideHeaderCtaButtons}>
        {children}
      </LayoutUnauthorized>
    )}
  </div>
);

export const LayoutNew = compose<IStateProps, { "data-test-id"?: string } & IExternalProps>(
  appConnect<IStateProps, {}, {}>({
    stateToProps: state => ({
      userIsAuthorized: selectIsAuthorized(state.auth),
    }),
  }),
)(LayoutComponent);
