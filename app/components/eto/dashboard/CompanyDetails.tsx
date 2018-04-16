import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { ChartPie, IChartPieData } from "../../shared/charts/ChartPie";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { InlineIcon } from "../../shared/InlineIcon";
import { PanelWhite } from "../../shared/PanelWhite";
import { ISocialProfile } from "../../shared/SocialProfilesEditor";
import { LinkColumns } from "./LinkColumns";
import { RowLabeledDataSets } from "./RowLabeledDataSets";

import * as styles from "./CompanyDetails.module.scss";

interface IProps {
  location: string;
  foundedDate: string;
  founders: string[];
  legalForm: string;
  employeesNumber: number;
  vat: string;
  registration: string;
  chartData: IChartPieData;
  socialProfiles: ISocialProfile[];
}

export const CompanyDetails: React.SFC<IProps> = props => {
  return (
    <PanelWhite>
      <Container className="py-3">
        <RowLabeledDataSets
          dataSets={[
            {
              title: "location",
              content: props.location,
            },
            {
              title: "Founded date",
              content: props.foundedDate,
            },
            {
              title: "Founders",
              content: props.founders,
            },
            {
              title: "Legal Form",
              content: props.legalForm,
            },
            {
              title: "Number of employees",
              content: props.employeesNumber,
            },
            {
              title: "Vat",
              content: props.vat,
            },
            {
              title: "Registration",
              content: props.registration,
            },
          ]}
        />

        <HorizontalLine className="my-4" />

        {props.socialProfiles.map(
          ({ name, svgIcon, url }, index) =>
            !!url && (
              <Row className={index !== 0 ? "mt-3" : ""} key={name}>
                <Col xs={12} md={5} className={styles.label}>
                  <InlineIcon svgIcon={svgIcon} />
                  <span>{name}</span>
                </Col>
                <Col xs={12} md={7}>
                  <Link to={url}>{url}</Link>
                </Col>
              </Row>
            ),
        )}

        <HorizontalLine className="my-4" />

        <Row>
          <Col xs={12} md={6}>
            <ChartPie data={props.chartData} />
          </Col>
        </Row>

        <HorizontalLine className="my-4" />

        <LinkColumns
          categories={[
            {
              name: "Advisors",
              links: [
                {
                  title: "advisor 1",
                  url: "sample url",
                },
                {
                  title: "advisor 1",
                  url: "sample url",
                },
              ],
            },
            {
              name: "Notable Investors",
              links: [
                {
                  title: "investor 1",
                  url: "sample url",
                },
                {
                  title: "investor 2",
                  url: "sample url",
                },
                {
                  title: "investor 3",
                  url: "sample url",
                },
              ],
            },
          ]}
        />
      </Container>
    </PanelWhite>
  );
};
