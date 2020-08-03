import { etoModuleApi, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Container, EColumnSpan } from "../../../../../layouts/Container";
import { DashboardHeading } from "../../../../../shared/DashboardHeading";
import { Panel } from "../../../../../shared/Panel";
import { EtoTimeline } from "./timeline/EtoTimeline";

import * as styles from "./ETOTimeline.module.scss";

const ETOTimeline: React.FunctionComponent<{ eto: TEtoWithCompanyAndContractReadonly }> = ({
  eto,
}) => (
  <Container columnSpan={EColumnSpan.THREE_COL}>
    <DashboardHeading
      title={
        <div className={styles.headerWithButton}>
          <FormattedMessage id="eto.public-view.eto-timeline" />
        </div>
      }
    />
    <Panel>
      <EtoTimeline
        state={eto.state}
        subState={eto.subState}
        currentState={etoModuleApi.utils.isOnChain(eto) ? eto.contract.timedState : undefined}
        startOfStates={etoModuleApi.utils.isOnChain(eto) ? eto.contract.startOfStates : undefined}
      />
    </Panel>
  </Container>
);

export { ETOTimeline };
