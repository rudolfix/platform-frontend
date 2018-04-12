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
import { TUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { appRoutes } from "../AppRouter";

interface IMenuEntry {
  svgString: string;
  title: string;
  actionRequired?: boolean;
}

interface IStateProps {
  userType?: TUserType;
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

export const LayoutAuthorizedMenuComponent = ({ userType }: IStateProps) => {
  if (userType === "investor")
    return (
      <div className={styles.menu} data-test-id="investor-menu">
        <MenuEntry svgString={iconStart} to={appRoutes.dashboard} title="Start" />
        <MenuEntry svgString={iconPortfolio} to="#" title="Portfolio" />
        <MenuEntry svgString={iconWallet} to={appRoutes.wallet} title="Wallet" />
        <MenuEntry
          svgString={iconSettings}
          to={appRoutes.settings}
          title="Settings"
          actionRequired
        />
      </div>
    );

  if (userType === "issuer")
    return (
      <div className={styles.menu} data-test-id="issuer-menu">
        {/*TODO: Change icons to real icons when received by the designer*/}
        {/*TODO: Connect icons with real routes */}
        <MenuEntry svgString={iconStart} to={appRoutes.eto} title="Overview" />
        <MenuEntry svgString={iconWallet} to={appRoutes.eto} title="Edit Page" />
        <MenuEntry
          svgString={iconSettings}
          to={appRoutes.settings}
          title="Settings"
          actionRequired
        />
      </div>
    );

  throw new Error("Menu loaded in wrong state, user should be either issuer or investor");
};

export const LayoutAuthorizedMenu = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    userType: selectUserType(s.auth),
  }),
})(LayoutAuthorizedMenuComponent);
