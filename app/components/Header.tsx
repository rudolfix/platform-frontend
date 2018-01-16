import * as React from "react";
import { NavLink } from "react-router-dom";
import { Navbar } from "reactstrap";

import * as styles from "./Header.module.scss";

export const Header = () => (
  // This navbar and navigation is just placeholder
  <Navbar color="primary" dark>
    <NavLink exact to="/" className={styles.link} activeClassName={styles.active}>
      Neufund Platform
    </NavLink>

    <NavLink exact to="/walletselector" className={styles.link} activeClassName={styles.active}>
      Wallet Selector
    </NavLink>

    <NavLink exact to="/kyc" className={styles.link} activeClassName={styles.active}>
      KYC
    </NavLink>

    <NavLink exact to="/dashboard" className={styles.link} activeClassName={styles.active}>
      Dashboard
    </NavLink>
  </Navbar>
);
