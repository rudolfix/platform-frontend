import * as React from "react";

import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import { PanelDark } from "../../shared/PanelDark";
import { MyNeuWidget } from "./MyNeuWidget";
import * as styles from "./MyPortfolioWidget.module.scss";

import { Link } from "react-router-dom";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import { CommonHtmlProps } from "../../../types";
import { Button } from "../../shared/Buttons";

export const MyPortfolio: React.SFC<CommonHtmlProps> = ({ className, style }) => {
  return (
    <PanelDark headerText="My portfolio" className={className} style={style}>
      <Row className={cn(styles.main, "pb-3")}>
        <Col xl={8} md={7} xs={12} className="mt-5 text-center mb-4 ">
          <h3>Welcome to NEUFUND!</h3>
          <p>You have no assets in your portifolio yet.</p>
          <Link to="#">
            <Button layout="icon-after" svgIcon={arrowRight}>
              Investment Opportunities
            </Button>
          </Link>
        </Col>
        <Col xl={4} md={5} xs={12} className="mt-3">
          <MyNeuWidget
            balanceNeu={"250045" + "0".repeat(14)}
            balanceEur={"456678" + "0".repeat(15)}
            ratioNeu={"5637" + "0".repeat(14)}
          />
        </Col>
      </Row>
    </PanelDark>
  );
};
