import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import * as logo from "../../app/assets/img/logo_yellow.svg";
import { appRoutes } from "./AppRouter";
import * as styles from "./Header.module.scss";

export const Header: React.SFC = () => (
  <Navbar dark className="bg-dark">
    <Link to={appRoutes.root} className="navbar-brand">
      <img src={logo} className={styles.logo} />
    </Link>
  </Navbar>
);
