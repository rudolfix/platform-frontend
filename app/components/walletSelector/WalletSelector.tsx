import * as cn from "classnames";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { HiResImage } from "../HiResImage";
import {Browser} from "./Browser";
import {Ledger} from "./Ledger";
import {Light} from "./Light";
import * as styles from "./WalletSelector.module.scss";

interface IWalletSelectorProps {
  walletInBrowserSelectedAction: () => any;
  ledgerWalletSelectedAction: () => any;
  lightWalletSelectedAction: () => any;
  walletInBrowserSelected: boolean;
  ledgerWalletSelected: boolean;
  lightWalletSelected: boolean;
}

export const WalletSelectorComponent: React.SFC<IWalletSelectorProps> = ({
  walletInBrowserSelected,
  ledgerWalletSelected,
                                                                           lightWalletSelected,
  walletInBrowserSelectedAction,
  ledgerWalletSelectedAction,
                                                                           lightWalletSelectedAction,
}) => (
  <Container>
    <Row>
      <Col>
        <p>Please select your wallet.</p>
        <div>
          <div className={styles.walletSelector}>
            <WalletTab
              active={lightWalletSelected}
              onSelect={lightWalletSelectedAction}
              data-test-id="wallet-selector-light"
            >
              <HiResImage
                partialPath="wallet_selector/icon_light_wallet"
                className={styles.walletIcon}
              />Light Wallet
            </WalletTab>
            <WalletTab
              active={walletInBrowserSelected}
              onSelect={walletInBrowserSelectedAction}
              data-test-id="wallet-selector-browser"
            >
              <HiResImage partialPath="wallet_selector/icon_wallet" className={styles.walletIcon} />Wallet
              in your browser
            </WalletTab>
            <WalletTab
              active={ledgerWalletSelected}
              onSelect={ledgerWalletSelectedAction}
              data-test-id="wallet-selector-ledger"
            >
              <HiResImage partialPath="wallet_selector/icon_ledger" className={styles.walletIcon} />Ledger
              Nano Wallet
            </WalletTab>
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        {walletInBrowserSelected && <Browser />}
        {ledgerWalletSelected && <Ledger />}
        {lightWalletSelected && <Light />}
      </Col>
    </Row>
  </Container>
);

interface IWalletTab {
  active?: boolean;
  onSelect: () => any;
}

const WalletTab: React.SFC<IWalletTab> = ({ active, onSelect, children, ...props }) => {
  return (
    <div className={cn(styles.walletTab, { active })} onClick={onSelect} {...props}>
      <div className={styles.walletTabTitle}>{children}</div>
    </div>
  );
};

export const WalletSelector = () => (
  <WalletSelectorComponent
    walletInBrowserSelectedAction={() => {
      alert("Selected wallet in browser");
    }}
    ledgerWalletSelectedAction={() => {
      alert("Selected ledger wallet");
    }}
    lightWalletSelectedAction={() => {
      alert("Selected light wallet");
    }}
    walletInBrowserSelected
    ledgerWalletSelected={false}
    lightWalletSelected={false}
  />
);
