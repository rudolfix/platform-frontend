import * as classNames from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { NavLink } from "react-router-dom";

import { GovernancePages, TGovernancePage } from "./constants";

import styles from "./GovernanceNav.module.scss";

export const GovernanceNavigationMenu = () => (
  <div className={styles.wrapper}>
    <ul className={styles.navList}>
      {GovernancePages.map((menuItem: TGovernancePage) => (
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
