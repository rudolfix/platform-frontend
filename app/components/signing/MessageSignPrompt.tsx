import * as React from "react";
import { Col, Row } from "reactstrap";

import * as ledgerConfirm from "../../assets/img/wallet_selector/ledger_confirm.svg";
import * as walletConfirmIcon from "../../assets/img/wallet_selector/wallet_confirm_icon.svg";
import { selectConnectedWeb3State } from "../../modules/web3/selectors";
import { WalletType } from "../../modules/web3/types";
import { appConnect } from "../../store";

interface IStateProps {
  walletType: WalletType;
}

export const BrowserWalletMessageSignPrompt: React.SFC = () => (
  <Row className="text-center">
    <Col>
      <h1>Confirm your wallet ownership</h1>
      <img className="mt-5 mb-4" src={walletConfirmIcon} />
      <p className="font-weight-bold">
        Please confirm on selected existing wallet that you will be using it for Neufund platform
      </p>
    </Col>
  </Row>
);

export const LedgerWalletMessageSignPrompt: React.SFC = () => (
  <Row className="text-center">
    <Col>
      <h1>Confirm you Ledger Ownership</h1>
      <img className="mt-5 mb-4" src={ledgerConfirm} />
      <p className="font-weight-bold">
        Please confirm on your Nano Ledger that you are an owner of the device by clicking on the
        right button
      </p>
    </Col>
  </Row>
);

export const MessageSignPromptComponent: React.SFC<IStateProps> = ({ walletType }) => {
  return walletType === WalletType.LEDGER ? (
    <LedgerWalletMessageSignPrompt />
  ) : (
    <BrowserWalletMessageSignPrompt />
  );
};

export const MessageSignPrompt = appConnect<IStateProps>({
  stateToProps: s => ({
    walletType: selectConnectedWeb3State(s.web3).wallet.walletType,
  }),
})(MessageSignPromptComponent);
