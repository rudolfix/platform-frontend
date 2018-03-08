import * as cn from "classnames";
import * as React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { InlineIcon } from "../shared/InlineIcon";

import * as styles from "./LayoutAuthorizedMenu.module.scss";

// tslint:disable-next-line:no-implicit-dependencies
import * as iconStart from "!raw-loader!../../assets/img/icon_home_active.svg";
// tslint:disable-next-line:no-implicit-dependencies
import * as iconPortfolio from "!raw-loader!../../assets/img/icon_portfolio_inactive.svg";
// tslint:disable-next-line:no-implicit-dependencies
import * as iconSettings from "!raw-loader!../../assets/img/icon_settings_inactive.svg";
// tslint:disable-next-line:no-implicit-dependencies
import * as iconWallet from "!raw-loader!../../assets/img/icon_wallet_inactive.svg";

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
    <MenuEntry svgString={iconStart} to="/dashboard">
      Start
    </MenuEntry>
    <MenuEntry svgString={iconPortfolio} to="/">
      Portfolio
    </MenuEntry>
    <MenuEntry svgString={iconWallet} to="/">
      Wallet
    </MenuEntry>
    <MenuEntry svgString={iconSettings} to="/" actionRequired>
      Settings
    </MenuEntry>
  </div>
);
