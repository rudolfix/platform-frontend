import { TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Container, EColumnSpan, EContainerType } from "../../../../../layouts/Container";
import { DashboardHeading } from "../../../../../shared/DashboardHeading";
import { Panel } from "../../../../../shared/Panel";
import { IPerson, PeopleSwiperWidget } from "../../../../../shared/PeopleSwiperWidget";
import { TabContent, Tabs } from "../../../../../shared/Tabs";
import { areThereIndividuals } from "./utils";

const Individuals: React.FunctionComponent<{ eto: TEtoWithCompanyAndContractReadonly }> = ({
  eto,
}) => {
  const {
    advisors,
    team,
    boardMembers,
    keyAlliances,
    keyCustomers,
    partners,
    notableInvestors,
  } = eto.company;

  const showTeam = areThereIndividuals(team);
  const showPartners = areThereIndividuals(partners);
  const showNotableInvestors = areThereIndividuals(notableInvestors);
  const showAdvisors = areThereIndividuals(advisors);
  const showKeyAlliances = areThereIndividuals(keyAlliances);
  const showKeyCustomers = areThereIndividuals(keyCustomers);
  const showBoardMembers = areThereIndividuals(boardMembers);

  const tabFlags = [showAdvisors, showKeyCustomers, showKeyAlliances, showBoardMembers];
  const selectedTabIndex = tabFlags.indexOf(true) % tabFlags.filter(flag => flag).length;
  const showTabs = selectedTabIndex > -1;

  return (
    <>
      {showTeam && (
        <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
          <DashboardHeading title={<FormattedMessage id="eto.public-view.carousel.team" />} />
          <Panel>
            <PeopleSwiperWidget people={team!.members as IPerson[]} key={"team"} />
          </Panel>
        </Container>
      )}

      {showPartners && (
        <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
          <DashboardHeading
            title={<FormattedMessage id="eto.public-view.carousel.tab.partners" />}
          />
          <Panel>
            <PeopleSwiperWidget people={partners!.members as IPerson[]} key="partners" />
          </Panel>
        </Container>
      )}

      {showNotableInvestors && (
        <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
          <DashboardHeading
            title={<FormattedMessage id="eto.public-view.carousel.tab.investors" />}
          />
          <Panel>
            <PeopleSwiperWidget
              people={notableInvestors!.members as IPerson[]}
              key="notableInvestors"
            />
          </Panel>
        </Container>
      )}

      {showTabs && (
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <Tabs
            className="mb-3"
            layoutSize="large"
            layoutOrnament={false}
            selectedIndex={selectedTabIndex}
          >
            {showAdvisors && (
              <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.advisors" />}>
                <Panel>
                  <PeopleSwiperWidget people={advisors!.members as IPerson[]} key="team" />
                </Panel>
              </TabContent>
            )}
            {showKeyCustomers && (
              <TabContent
                tab={<FormattedMessage id="eto.public-view.carousel.tab.key-customers" />}
              >
                <Panel>
                  <PeopleSwiperWidget
                    key="keyCustomers"
                    people={keyCustomers!.members as IPerson[]}
                  />
                </Panel>
              </TabContent>
            )}
            {showBoardMembers && (
              <TabContent
                tab={<FormattedMessage id="eto.public-view.carousel.tab.board-members" />}
              >
                <Panel>
                  <PeopleSwiperWidget
                    key="boardMembers"
                    people={boardMembers!.members as IPerson[]}
                  />
                </Panel>
              </TabContent>
            )}
            {showKeyAlliances && (
              <TabContent
                tab={<FormattedMessage id="eto.public-view.carousel.tab.key-alliances" />}
              >
                <Panel>
                  <PeopleSwiperWidget
                    key="keyAlliances"
                    people={keyAlliances!.members as IPerson[]}
                  />
                </Panel>
              </TabContent>
            )}
          </Tabs>
        </Container>
      )}
    </>
  );
};

export { Individuals };
