import * as React from "react";

import { DashboardTitle } from "../../dashboard/DashboardTitle";
import { Container, EColumnSpan } from "../../layouts/Container";
import { WidgetGrid } from "../../layouts/WidgetGrid";

import * as styles from "../NomineeDashboard.module.scss";

const AccountSetupContainer: React.FunctionComponent = ({ children }) => (
  <WidgetGrid>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <DashboardTitle />
      <div data-test-id="nominee-dashboard" className={styles.accountSetupWrapper}>
        {children}
      </div>
    </Container>
  </WidgetGrid>
);
export { AccountSetupContainer };
