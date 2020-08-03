import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Redirect, Route } from "react-router-dom";
import { compose } from "redux";

import { SwitchConnected } from "../../../utils/react-connected-components/connectedRouting";
import { appRoutes } from "../../appRoutes";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { Heading } from "../../shared/Heading";
import { withContainer } from "../../shared/hocs/withContainer";
import { GeneralInformation } from "./GeneralInformation/GeneralInformation";
import { GovernanceContainer } from "./GovernanceContainer";
import { GovernanceNavigationMenu } from "./GovernanceNavigationMenu";
import { GovernanceOverview } from "./GovernanceOverview/GovernanceOverview";

export const GovernanceBase = () => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
      <Heading level={2} decorator={false}>
        <FormattedMessage id="governance.title" />
      </Heading>
    </Container>

    <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
      <GovernanceNavigationMenu />

      <Container columnSpan={EColumnSpan.TWO_COL}>
        <SwitchConnected>
          <Route path={appRoutes.governanceOverview} component={GovernanceOverview} />
          <Route path={appRoutes.governanceGeneralInformation} component={GeneralInformation} />
          <Redirect to={appRoutes.governanceOverview} />
        </SwitchConnected>
      </Container>
    </Container>
  </>
);

export const Governance = compose<React.FunctionComponent>(withContainer(GovernanceContainer))(
  GovernanceBase,
);
