import * as React from "react";
import { FormattedMessage } from "react-intl";
import { NavLink, NavLinkProps } from "react-router-dom";

import { TUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { selectIsActionRequiredSettings } from "../../modules/notifications/selectors";
import { appConnect } from "../../store";
import { invariant } from "../../utils/invariant";
import { appRoutes } from "../appRoutes";
import { InlineIcon } from "../shared/InlineIcon";

import * as iconEdit from "../../assets/img/inline_icons/icon_edit.svg";
import * as iconStart from "../../assets/img/inline_icons/icon_home_active.svg";
import * as iconSettings from "../../assets/img/inline_icons/icon_settings_inactive.svg";
import * as iconStats from "../../assets/img/inline_icons/icon_stats.svg";
import * as iconSupport from "../../assets/img/inline_icons/icon_support.svg";
import * as iconWallet from "../../assets/img/inline_icons/icon_wallet_inactive.svg";
import { externalRoutes } from "../externalRoutes";
import * as styles from "./LayoutAuthorizedMenu.module.scss";

interface IMenuEntry {
  svgString: string;
  menuName: string | React.ReactNode;
  actionRequired?: boolean;
  to: string;
}

interface IStateProps {
  userType?: TUserType;
  actionRequiredSettings: boolean;
}

const MenuEntryContent: React.SFC<IMenuEntry & NavLinkProps> = ({
  actionRequired,
  menuName,
  svgString,
  ...props
}) => {
  return (
    <>
      <span className={styles.icon} {...props}>
        <InlineIcon svgIcon={svgString} />
        {actionRequired && <div className={styles.actionIndicator} />}
      </span>
      <span className={styles.name}>{menuName}</span>
    </>
  );
};

const MenuEntry: React.SFC<IMenuEntry & NavLinkProps> = ({ to, svgString, ...props }) => {
  const isAbsoluteLink = /^https?:\/\//.test(to);

  return isAbsoluteLink ? (
    <a href={to} target="_blank" className={styles.menuItem}>
      <MenuEntryContent {...props} to={to} svgString={svgString} />
    </a>
  ) : (
    <NavLink to={to} className={styles.menuItem}>
      <MenuEntryContent {...props} to={to} svgString={svgString} />
    </NavLink>
  );
};

const InvestorMenu: React.SFC<{ actionRequiredSettings: boolean }> = ({
  actionRequiredSettings,
}) => (
  <div className={styles.menu}>
    <MenuEntry
      svgString={iconStart}
      to={appRoutes.dashboard}
      menuName={<FormattedMessage id="menu.start" />}
    />
    <MenuEntry
      svgString={iconWallet}
      to={appRoutes.wallet}
      menuName={<FormattedMessage id="menu.wallet" />}
    />
    <MenuEntry
      svgString={iconSettings}
      to={appRoutes.settings}
      menuName="Settings"
      actionRequired={actionRequiredSettings}
      data-test-id="authorized-layout-settings-button"
    />
    <MenuEntry
      svgString={iconSupport}
      to={externalRoutes.freshdesk}
      menuName={<FormattedMessage id="menu.help" />}
      target="_blank"
    />
  </div>
);

const IssuerMenu: React.SFC<{ actionRequiredSettings: boolean }> = ({ actionRequiredSettings }) => (
  <div className={styles.menu}>
    <MenuEntry
      svgString={iconStats}
      to={appRoutes.etoOverview}
      menuName={<FormattedMessage id="menu.overview" />}
    />
    <MenuEntry
      svgString={iconStats}
      to={appRoutes.dashboard}
      menuName={<FormattedMessage id="menu.overview" />}
    />
    {/*TODO: This route is not correct */}
    <MenuEntry
      svgString={iconEdit}
      to={appRoutes.eto}
      menuName={<FormattedMessage id="menu.edit-page" />}
    />{" "}
    <MenuEntry
      svgString={iconSettings}
      to={appRoutes.settings}
      menuName={<FormattedMessage id="menu.settings" />}
      actionRequired={actionRequiredSettings}
    />
    <MenuEntry
      svgString={iconSupport}
      to="https://neufund.freshdesk.com/support/home"
      menuName={<FormattedMessage id="menu.help" />}
      target="_blank"
    />
  </div>
);

export const LayoutAuthorizedMenuComponent: React.SFC<IStateProps> = ({ userType, ...props }) => {
  switch (userType) {
    case "investor":
      return <InvestorMenu data-test-id="investor-menu" {...props} />;
    case "issuer":
      return <IssuerMenu data-test-id="issuer-menu" {...props} />;
    default:
      return invariant(false, "Unknown user type");
  }
};

export const LayoutAuthorizedMenu = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    userType: selectUserType(s.auth),
    actionRequiredSettings: selectIsActionRequiredSettings(s),
  }),
})(LayoutAuthorizedMenuComponent);
