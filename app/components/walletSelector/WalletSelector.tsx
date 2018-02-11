import * as cn from "classnames";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { HiResImage } from "../HiResImage";
import { LayoutRegisterLogin } from "../LayoutRegisterLogin";
import { WalletRouter } from "./WalletRouter";
import { walletRoutes } from "./walletRoutes";
import * as styles from "./WalletSelector.module.scss";

interface IWalletTab {
  active?: boolean;
  onSelect: () => any;
}

const WalletTabComponent: React.SFC<IWalletTab> = ({ active, onSelect, children, ...props }) => {
  return (
    <div className={cn(styles.walletTab, { active })} onClick={onSelect} {...props}>
      <div className={styles.walletTabTitle}>{children}</div>
    </div>
  );
};

interface IWalletTabLink extends RouteComponentProps<{}> {
  href: string;
}

class WalletTabLink extends React.Component<IWalletTabLink> {
  onClick = () => {
    this.props.history.push(this.props.href);
  };

  render(): React.ReactNode {
    const { href, history, location, match, staticContext, ...props } = this.props;
    return (
      <WalletTabComponent
        onSelect={this.onClick}
        active={location.pathname.startsWith(href)}
        {...props}
      />
    );
  }
}

const WalletTab = withRouter<IWalletTabLink>(WalletTabLink);

export const WalletSelector: React.SFC = () => (
  <LayoutRegisterLogin>
    <Row>
      <Col>
        <p>Please select your wallet.</p>
        <div>
          <div className={styles.walletSelector}>
            <WalletTab href={walletRoutes.light} data-test-id="wallet-selector-light">
              <HiResImage
                partialPath="wallet_selector/icon_light_wallet"
                className={styles.walletIcon}
              />Light Wallet
            </WalletTab>
            <WalletTab href={walletRoutes.browser} data-test-id="wallet-selector-browser">
              <HiResImage partialPath="wallet_selector/icon_wallet" className={styles.walletIcon} />Wallet
              in your browser
            </WalletTab>
            <WalletTab href={walletRoutes.ledger} data-test-id="wallet-selector-ledger">
              <HiResImage partialPath="wallet_selector/icon_ledger" className={styles.walletIcon} />Ledger
              Nano Wallet
            </WalletTab>
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <WalletRouter />
      </Col>
    </Row>
  </LayoutRegisterLogin>
);
