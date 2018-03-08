import * as React from "react";

import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import { ArrowLink } from "../../shared/ArrowLink";
import { PanelDark } from "../../shared/PanelDark";
import { MyNeuWidget } from "./MyNeuWidget";
import * as styles from "./MyPortoflioWidget.module.scss";

export const MyPortfolio = () => {
  return (
    <PanelDark headerText="My portfolio">
      <Row className={cn(styles.main, "pb-3 bg-light")}>
        <Col xl={8} md={7} xs={12} className="mt-5 text-center mb-4 ">
          <h3>Welcome to NEUFUND!</h3>
          <p>You have no assets in your portifolio yet.</p>
          <ArrowLink arrowDirection="right" to="#">
            Investment Opportunities
          </ArrowLink>
        </Col>
        <Col xl={4} md={5} xs={12} className="mt-3">
          <MyNeuWidget balanceNeu="25.0045" balanceEur="456.678" ratioNeu="0.5637" />
        </Col>
      </Row>
    </PanelDark>
  );
};
