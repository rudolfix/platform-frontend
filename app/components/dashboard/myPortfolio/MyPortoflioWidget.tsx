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
      <Row className={cn(styles.main, "pb-3")}>
        <Col xs={8} className="mt-5 text-center">
          <h3>Welcome to NEUFUND!</h3>
          <p>You have no assets in your portifolio yet.</p>
          <ArrowLink arrowDirection="right" to="#">
            Investment Opportunities
          </ArrowLink>
        </Col>
        <Col xs={4} className="mt-3">
          <MyNeuWidget mode="broke" />
        </Col>
      </Row>
    </PanelDark>
  );
};
