import * as classNames from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { NavLink } from "react-router-dom";

import { Container } from "../../../layouts/Container";
import { EGovernancePage, GovernancePages } from "../constants";

import announcementIcon from "../../../../assets/img/governance_announcement.svg";
import esopIcon from "../../../../assets/img/governance_esop.svg";
import exitIcon from "../../../../assets/img/governance_exit.svg";
import pieChartIcon from "../../../../assets/img/governance_pie_chart.svg";
import tokenIcon from "../../../../assets/img/governance_token.svg";
import voteIcon from "../../../../assets/img/governance_vote.svg";
import styles from "./GovernanceOverview.module.scss";

const icons: {
  [key in EGovernancePage]?: string;
} = {
  [EGovernancePage.GENERAL_INFORMATION]: announcementIcon,
  [EGovernancePage.CAP_TABLE]: voteIcon,
  [EGovernancePage.DIVIDENDS]: pieChartIcon,
  [EGovernancePage.TOKEN_MANAGEMENT]: tokenIcon,
  [EGovernancePage.ESOP]: esopIcon,
  [EGovernancePage.EXIT]: exitIcon,
};

export const GovernanceOverview = () => (
  <Container>
    <ul className={styles.list}>
      {GovernancePages.filter((_item, index) => index > 0).map(item => (
        <NavLink
          className={classNames(styles.card, { [styles.disabled]: item.comingSoon })}
          aria-disabled={item.comingSoon}
          key={item.key}
          to={item.to}
        >
          <img src={icons[item.key]} alt={item.label as string} />
          <span className={styles.title}>{item.label}</span>
          <span className={styles.comingSoon}>
            {item.comingSoon ? (
              <FormattedMessage id="common.coming-soon" />
            ) : (
              /*empty space to keep title aligned with other cards*/
              <span>&nbsp;</span>
            )}
          </span>
        </NavLink>
      ))}
    </ul>
  </Container>
);
