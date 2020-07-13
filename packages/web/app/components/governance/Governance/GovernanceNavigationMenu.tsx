import * as classNames from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { NavLink } from "react-router-dom";

import { appRoutes } from "../../appRoutes";

import styles from "./GovernanceNav.module.scss";

const menuItems = [
  {
    key: "overview",
    to: appRoutes.governanceOverview,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.overview" />,
  },
  {
    key: "general-information",
    to: appRoutes.governanceGeneralInformation,
    label: <FormattedMessage id="governance.title.general-information" />,
  },
  {
    key: "cap-table",
    to: appRoutes.governanceCapTable,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.cap-table" />,
  },
  {
    key: "dividends",
    to: appRoutes.governanceDividends,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.dividends" />,
  },
  {
    key: "token-management",
    to: appRoutes.governanceTokenManagement,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.token-management" />,
  },
  {
    key: "esop",
    to: appRoutes.governanceEsop,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.esop" />,
  },
  {
    key: "exit",
    to: appRoutes.governanceExit,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.exit" />,
  },
];

export const GovernanceNavigationMenu = () => (
  <div>
    <ul className={styles.navList}>
      {menuItems.map(menuItem => (
        <NavLink
          key={menuItem.key}
          className={classNames(styles.navItem, { [styles.disabled]: menuItem.comingSoon })}
          activeClassName={styles.navItemActive}
          exact
          to={menuItem.to}
        >
          <span className={styles.navItemLabel}>{menuItem.label}</span>
          &nbsp;
          {menuItem.comingSoon && (
            <span className={styles.navItemHelperText}>
              (<FormattedMessage id="common.coming-soon" />)
            </span>
          )}
        </NavLink>
      ))}
    </ul>
  </div>
);
