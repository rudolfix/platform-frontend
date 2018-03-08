import * as cn from "classnames";
import * as React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { InlineIcon } from "../shared/InlineIcon";

import * as styles from "./LayoutAuthorizedMenu.module.scss";

import * as iconStart from "../../assets/img/icon_home_active.svg"
import * as iconPortfolio from "../../assets/img/icon_portfolio_inactive.svg"
import * as iconSettings from "../../assets/img/icon_settings_inactive.svg"
import * as iconWallet from "../../assets/img/icon_wallet_inactive.svg"

interface IMenuEntry {
  svgString: string;
  actionRequired?: boolean;
}

const MenuEntry: React.SFC<IMenuEntry & NavLinkProps> = ({
  actionRequired,
  to,
  svgString,
  children,
}) => {
  return (
    <NavLink to={to} className={cn(styles.menuItem, svgString)} exact>
      <span className={styles.icon}>
        <InlineIcon svgIcon={svgString} />
        {actionRequired && <div className={styles.actionIndicator} />}
      </span>
      <span className={styles.name}>{children}</span>
    </NavLink>
  );
};

export const LayoutAuthorizedMenu = () => (
  <div className={styles.menu}>
    <MenuEntry svgString={iconStart} to="/">
      Start
    </MenuEntry>
    <MenuEntry svgString={iconPortfolio} to="/dashboard">
      Portfolio
    </MenuEntry>
    <MenuEntry svgString={iconWallet} to="/">
      Wallet
    </MenuEntry>
    <MenuEntry svgString={iconSettings} to="/" actionRequired>
      Settings
    </MenuEntry>
  </div >
);
