import * as React from "react";
import { Col } from "reactstrap";

import { etoCompaniesCards } from "../../../data/etoCompanies";
import { EtoCard } from "../../shared/EtoCard";
import { SectionHeader } from "../../shared/SectionHeader";

export const EtoListDummies: React.FunctionComponent = () => (
  <>
    <Col xs={12}>
      <SectionHeader>ETO Offerings</SectionHeader>
    </Col>
    {etoCompaniesCards.map((eto, index) => (
      <Col xs={12} lg={6} key={index}>
        <EtoCard {...eto} className="responsive" />
      </Col>
    ))}
  </>
);
