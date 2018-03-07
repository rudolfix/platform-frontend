import * as cn from "classnames";
import * as React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

import * as styles from "./LayoutAuthorizedMenu.module.scss";

interface IMenuEntry {
  iconClass: string;
  actionRequired?: boolean;
}

const MenuEntry: React.SFC<IMenuEntry & NavLinkProps> = ({
  iconClass,
  actionRequired,
  to,
  children,
}) => {
  return (
    <NavLink to={to} className={cn(styles.menuItem, iconClass)} exact>
      <span className={styles.name}>{children}</span>
      {actionRequired && <div className={styles.actionRequired} />}
    </NavLink>
  );
};

export const LayoutAuthorizedMenu = () => (
  <div className={styles.menu}>
    <MenuEntry iconClass={styles.start} to="/">
      Start
    </MenuEntry>
    <MenuEntry iconClass={styles.portfolio} to="/dashboard">
      Portfolio
    </MenuEntry>
    <MenuEntry iconClass={styles.wallet} to="/">
      Wallet
    </MenuEntry>
    <MenuEntry iconClass={styles.settings} to="/" actionRequired>
      Settings
    </MenuEntry>
  </div>
);
