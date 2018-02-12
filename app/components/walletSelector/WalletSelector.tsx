import * as cn from "classnames";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { WalletRouter } from "./WalletRouter";
import { walletRoutes } from "./walletRoutes";
import * as styles from "./WalletSelector.module.scss";

export const WalletSelector: React.SFC = () => (
  <LayoutRegisterLogin>
    <Row>
      <Col
        className={cn(
          "d-flex flex-column flex-md-row justify-content-center mt-4 mb-5",
          styles.walletChooser,
        )}
      >
        <NavLink
          className={cn("mb-3 mb-md-0", styles.wallet)}
          to={walletRoutes.light}
          data-test-id="wallet-selector-light"
        >
          use Neufund wallet
        </NavLink>
        <NavLink
          className={cn("mb-3 mb-md-0", styles.wallet)}
          to={walletRoutes.browser}
          data-test-id="wallet-selector-browser"
        >
          use existing wallet
        </NavLink>
        <NavLink
          className={cn("mb-3 mb-md-0", styles.wallet)}
          to={walletRoutes.ledger}
          data-test-id="wallet-selector-ledger"
        >
          use nano ledger
        </NavLink>
      </Col>
    </Row>
    <Row>
      <Col>
        <WalletRouter />
      </Col>
    </Row>
  </LayoutRegisterLogin>
);
