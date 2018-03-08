import * as cn from "classnames";
import * as React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { InlineIcon } from "../shared/InlineIcon";

import * as styles from "./LayoutAuthorizedMenu.module.scss";

// tslint:disable-next-line:no-implicit-dependencies
import * as iconStart from "../../assets/img/inline_icons/icon_home_active.svg";
// tslint:disable-next-line:no-implicit-dependencies
import * as iconPortfolio from "../../assets/img/inline_icons/icon_portfolio_inactive.svg";
// tslint:disable-next-line:no-implicit-dependencies
import * as iconSettings from "../../assets/img/inline_icons/icon_settings_inactive.svg";
// tslint:disable-next-line:no-implicit-dependencies
import * as iconWallet from "../../assets/img/inline_icons/icon_wallet_inactive.svg";

interface IMenuEntry {
  svgString: string;
  title: string;
  actionRequired?: boolean;
}

const MenuEntry: React.SFC<IMenuEntry & NavLinkProps> = ({
  actionRequired,
  title,
  to,
  svgString,
}) => {
  return (
    <NavLink to={to} className={cn(styles.menuItem, svgString)}>
      <span className={styles.icon}>
        <InlineIcon svgIcon={svgString} />
        {actionRequired && <div className={styles.actionIndicator} />}
      </span>
      <span className={styles.name}>{title}</span>
    </NavLink>
  );
};

export const LayoutAuthorizedMenu = () => (
  <div className={styles.menu}>
    <MenuEntry svgString={iconStart} to="/dashboard" title="Start" />
    <MenuEntry svgString={iconPortfolio} to="/portfolio" title="Portfolio" />
    <MenuEntry svgString={iconWallet} to="/wallet" title="Wallet" />
    <MenuEntry svgString={iconSettings} to="/settings" title="Settings" actionRequired />
  </div>
);
