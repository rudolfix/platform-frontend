import * as cn from "classnames";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { ReactNode } from "react-redux";
import { HiResImage } from "../HiResImage";
import { WalletBrowser } from "./WalletBrowser";
import { WalletLedger } from "./WalletLedger";
import { WalletLight } from "./WalletLight";
import * as styles from "./WalletSelector.module.scss";

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
        {walletInBrowserSelected && <WalletBrowser />}
        {ledgerWalletSelected && <WalletLedger />}
        {lightWalletSelected && <WalletLight />}
      </Col>
    </Row>
  </Container>
);

interface IWalletSelectorState {
  selectedIndex: WalletSelectorTab;
}

enum WalletSelectorTab {
  LIGHT_WALLET = "LIGHT_WALLET",
  WALLET_IN_BROWSER = "WALLET_IN_BROWSER",
  LEDGER_WALLET = "LEDGER_WALLET",
}

export class WalletSelector extends React.Component<{}, IWalletSelectorState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedIndex: WalletSelectorTab.LIGHT_WALLET,
    };
  }

  onSelectTab = (tab: WalletSelectorTab) => () => {
    this.setState({
      selectedIndex: tab,
    });
  };

  render(): ReactNode {
    return (
      <WalletSelectorComponent
        lightWalletSelectedAction={this.onSelectTab(WalletSelectorTab.LIGHT_WALLET)}
        walletInBrowserSelectedAction={this.onSelectTab(WalletSelectorTab.WALLET_IN_BROWSER)}
        ledgerWalletSelectedAction={this.onSelectTab(WalletSelectorTab.LEDGER_WALLET)}
        lightWalletSelected={this.state.selectedIndex === WalletSelectorTab.LIGHT_WALLET}
        walletInBrowserSelected={this.state.selectedIndex === WalletSelectorTab.WALLET_IN_BROWSER}
        ledgerWalletSelected={this.state.selectedIndex === WalletSelectorTab.LEDGER_WALLET}
      />
    );
  }
}
