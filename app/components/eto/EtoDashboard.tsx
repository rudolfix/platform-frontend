import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { Accordion, AccordionElement } from "../shared/Accordion";
import { Button } from "../shared/Buttons";
import { InlineIcon } from "../shared/InlineIcon";
import { PanelDark } from "../shared/PanelDark";
import { PanelWhite } from "../shared/PanelWhite";
import { SectionHeader } from "../shared/SectionHeader";
import { CompanyDetails } from "./dashboard/CompanyDetails";
import { EtoOverview } from "./dashboard/EtoOverview";
import { FounderTeam } from "./dashboard/FounderTeam";
import { LinkColumns } from "./dashboard/LinkColumns";
import { QuestionsAndAnswers } from "./dashboard/QuestionsAndAnswers";
import { RowLabeledDataSets } from "./dashboard/RowLabeledDataSets";

import * as downloadIcon from "../../assets/img/inline_icons/download.svg";
import * as editIcon from "../../assets/img/inline_icons/edit.svg";
import * as facebookIcon from "../../assets/img/inline_icons/social_facebook.svg";
import * as linkedinIcon from "../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import * as telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const chartPieData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah"],
  datasets: [
    {
      data: [100, 50, 20, 40, 50, 12],
      backgroundColor: ["#394651", "#c4c5c6", "#616611", "#9fa914", "#d5e20f", "#0b0e11"],
    },
  ],
};

export const EtoDashboard: React.SFC = () => (
  <LayoutAuthorized>
    <Row>
      <Col lg={8} xs={12}>
        <SectionHeader>
          Eto overview <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>
      </Col>
    </Row>
    <Row>
      <Col lg={8} xs={12}>
        <Row className="py-4">
          <Col>
            <EtoOverview
              companyName="Sample compnay name"
              logoImageSrc="logo src"
              description={loremIpsum}
              tags={[
                {
                  text: "tag 1",
                },
                {
                  text: "sample tag 2",
                },
              ]}
              startDate="22.01.2012"
              endDate="22.01.2012"
              tokenImageSrc="token src"
              goalValue="4650000000000"
              goalSymbol="neu"
              currentValueationValue="4650000000000"
              currentValueationSymbol="eur"
              tokenPriceNeu="2500"
              tokenPriceEth="25"
              tokenSymbol="XXX"
              linkToDetailedTokenInfo="#0"
            />
          </Col>
        </Row>

        <SectionHeader>
          Compoany details <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>

        <Row className="py-4">
          <Col>
            <CompanyDetails
              location="Berlin, Germany"
              foundedDate="2012/12/22"
              founders={["founder 1", "founder2"]}
              legalForm="Lorem Ipsum"
              employeesNumber={22}
              vat="DE12345666"
              registration="XXXXXXXXXXXX"
              chartData={chartPieData}
              socialProfiles={[
                {
                  name: "LinkedIn",
                  url: "linkedin.com",
                  svgIcon: linkedinIcon,
                },
                {
                  name: "Facebook",
                  url: "facebook.com",
                  svgIcon: facebookIcon,
                },
                {
                  name: "Medium",
                  svgIcon: mediumIcon,
                },
                {
                  name: "Reddit",
                  url: "reddit.com",
                  svgIcon: redditIcon,
                },
                {
                  name: "Telegram",
                  svgIcon: telegramIcon,
                },
              ]}
            />
          </Col>
        </Row>

        <SectionHeader>
          Last funding round <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>

        <Row className="py-4">
          <Col>
            <PanelWhite>
              <Container className="py-3">
                <RowLabeledDataSets
                  dataSets={[
                    {
                      title: "Total investment",
                      content: "€ 400M",
                    },
                    {
                      title: "Investors number",
                      content: "4",
                    },
                    {
                      title: "Prominent investors",
                      content: ["sample investor", "sample investor 2"],
                    },
                  ]}
                />
              </Container>
            </PanelWhite>
          </Col>
        </Row>

        <SectionHeader>
          Founder / leadership team <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>

        <Row className="py-4">
          <Col>
            <FounderTeam
              teamMembers={[
                {
                  name: "test name 1",
                  title: "test title 1",
                  bioLink: "bio link",
                  imageSrc: "sample src1 ",
                  socialProfilesLinks: [
                    {
                      svgIcon: facebookIcon,
                      url: "sample url 1",
                    },
                  ],
                },
                {
                  name: "test name 3",
                  title: "test title 3",
                  bioLink: "bio link",
                  imageSrc: "sample src 2",
                  socialProfilesLinks: [
                    {
                      svgIcon: facebookIcon,
                      url: "sample url",
                    },
                  ],
                },
                {
                  name: "test name 2",
                  title: "test title 2",
                  bioLink: "bio link",
                  imageSrc: "sample src3",
                  socialProfilesLinks: [
                    {
                      svgIcon: facebookIcon,
                      url: "sample url",
                    },
                  ],
                },
              ]}
            />
          </Col>
        </Row>

        <SectionHeader>
          Product pitch <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>

        <Row className="py-4">
          <Col>
            <QuestionsAndAnswers
              questionsAndAnswers={[
                {
                  question: "What is the exac problem the company is solving and how",
                  answer: loremIpsum,
                },
                {
                  question: "Exact target segment of the product",
                  answer: loremIpsum,
                },
                {
                  question: "Product/company vision",
                  answer: loremIpsum,
                },
                {
                  question: "Founders motivation",
                  answer: loremIpsum,
                },
                {
                  question: "How will the rised capital be used",
                  answer: loremIpsum,
                },
                {
                  question: "Product roadmap",
                  answer: loremIpsum,
                },
              ]}
            />
          </Col>
        </Row>

        <SectionHeader>
          Market conditions <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>

        <Row className="py-4">
          <Col>
            <QuestionsAndAnswers
              questionsAndAnswers={[
                {
                  question: "What is the business model?",
                  answer: loremIpsum,
                },
                {
                  question: "What is the marketing strategy?",
                  answer: loremIpsum,
                },
                {
                  question: "USP",
                  answer: loremIpsum,
                },
                {
                  question: "Who are your key competitors?",
                  answer: loremIpsum,
                },
              ]}
            />
          </Col>
        </Row>

        <SectionHeader>
          Partners & customers <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>

        <Row className="py-4">
          <Col>
            <PanelWhite className="py-3">
              <Container>
                <LinkColumns
                  categories={[
                    {
                      name: "Business Partners",
                      links: [
                        {
                          title: "sample partner 1",
                          url: "sample url 1",
                        },
                        {
                          title: "sample partner 3",
                          url: "sample url 2",
                        },
                        {
                          title: "sample partner 3",
                          url: "sample url 3",
                        },
                      ],
                    },
                    {
                      name: "Key Customers",
                      links: [
                        {
                          title: "sample customer 1",
                          url: "sample url 1",
                        },
                        {
                          title: "sample customer 2",
                          url: "sample url 2",
                        },
                      ],
                    },
                  ]}
                />
              </Container>
            </PanelWhite>
          </Col>
        </Row>
      </Col>

      <Col className="py-4">
        <PanelDark
          headerText="ETO DOCUMENTS"
          rightComponent={
            <Button
              layout="secondary"
              theme="t-white"
              svgIcon={downloadIcon}
              iconPosition="icon-before"
              onClick={() => {}}
            >
              Download All
            </Button>
          }
        />
      </Col>
    </Row>
  </LayoutAuthorized>
);
