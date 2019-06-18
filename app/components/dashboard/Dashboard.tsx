import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../modules/actions";
import { onEnterAction } from "../../utils/OnEnterAction";
import { Container, EColumnSpan } from "../layouts/Container";
import { WidgetGridLayout } from "../layouts/Layout";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { Heading } from "../shared/Heading";
import { EtoList } from "./eto-list/EtoList";
import { MyPortfolioWidget } from "./my-portfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./my-wallet/MyWalletWidget";

export const DashboardLayout = () => (
  <LayoutAuthorized dataTestId="dashboard-application">
    <WidgetGridLayout>
      <MyPortfolioWidget />
      <MyWalletWidget />
      {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" && (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <Heading level={3} decorator={false}>
              <FormattedMessage id="dashboard.eto-opportunities" />
            </Heading>

            <p>
              <FormattedMessage id="dashboard.eto-opportunities.description" />
            </p>
          </Container>

          <EtoList />
        </>
      )}
    </WidgetGridLayout>
  </LayoutAuthorized>
);

export const Dashboard = compose<{}, {}>(
  setDisplayName("Dashboard"),
  onEnterAction({
    actionCreator: d => {
      d(actions.wallet.loadWalletData());
    },
  }),
)(DashboardLayout);
