import { kycApi } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { appConnect } from "../../store";

import * as styles from "./Dashboard.module.scss";

interface IDashboardTitleProps {
  firstName: string | undefined;
}

export const DashboardTitleSmall: React.FunctionComponent<IDashboardTitleProps> = ({
  firstName,
}) => (
  <div className={styles.dashboardTitleWrapper}>
    <h1 className={styles.dashboardTitleSmall}>
      <FormattedMessage id="dashboard.welcome" values={{ name: firstName }} />
    </h1>
  </div>
);

export const DashboardTitleLarge: React.FunctionComponent = () => (
  <div className={styles.dashboardTitleWrapper}>
    <h1 className={styles.dashboardTitle}>
      <FormattedMessage id="account-setup.welcome-to-neufund" />
    </h1>
  </div>
);

export const DashboardTitle = compose<IDashboardTitleProps, {}>(
  appConnect<IDashboardTitleProps>({
    stateToProps: state => ({
      firstName: kycApi.selectors.selectIndividualData(state)?.firstName,
    }),
  }),
  branch<IDashboardTitleProps>(
    ({ firstName }) => firstName === undefined,
    renderComponent(DashboardTitleLarge),
  ),
)(DashboardTitleSmall);
