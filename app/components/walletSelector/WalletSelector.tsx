import * as cn from "classnames";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { WalletRouter } from "./WalletRouter";
import { walletRoutes } from "./walletRoutes";
import * as styles from "./WalletSelector.module.scss";

interface IWalletTabLink extends RouteComponentProps<{}> {
  href: string;
}

class WalletTabLink extends React.Component<IWalletTabLink> {
  onClick = () => {
    this.props.history.push(this.props.href);
  };

  render(): React.ReactNode {
    const { href, location, children } = this.props;
    const active = location.pathname.startsWith(href);
    const child = React.Children.only(children);
    const className = cn(child.props.className, { active });

    return React.cloneElement(child, {
      className,
      onClick: this.onClick,
    });
  }
}

const WalletTab = withRouter<IWalletTabLink>(WalletTabLink);

export const WalletSelector: React.SFC = () => (
  <LayoutRegisterLogin>
    <Row>
      <Col
        className={cn(
          "d-flex flex-column flex-md-row justify-content-center mt-4 mb-5",
          styles.walletChooser,
        )}
      >
        <WalletTab href={walletRoutes.light} data-test-id="wallet-selector-light">
          <span className={cn("mb-3 mb-md-0", styles.wallet)}>use Neufund wallet</span>
        </WalletTab>
        <WalletTab href={walletRoutes.browser} data-test-id="wallet-selector-browser">
          <span className={cn("mb-3 mb-md-0", styles.wallet)}>use existing wallet</span>
        </WalletTab>
        <WalletTab href={walletRoutes.ledger} data-test-id="wallet-selector-ledger">
          <span className={cn("mb-3 mb-md-0", styles.wallet)}>use nano ledger</span>
        </WalletTab>
      </Col>
    </Row>
    <Row>
      <Col>
        <WalletRouter />
      </Col>
    </Row>
  </LayoutRegisterLogin>
);
