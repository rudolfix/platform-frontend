import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import * as icon from "../../../assets/img/neu_icon.svg";
import { Button } from "../../shared/Buttons";
import { Money } from "../../shared/Money";
import * as styles from "./MyNeuWidget.module.scss";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";

interface IProps {
  balanceNeu: string;
  balanceEur?: string;
  ratioNeu?: string;
}

export const MyNeuWidget: React.SFC<IProps> = props => {
  return props.balanceNeu === "0" ? (
    <div className={cn(styles.background)}>
      <h5 className={cn(styles.title, "text-left mb-3 mb-md-5 pl-3 pt-1")}>YOUR NEUMARK</h5>
      <Row noGutters>
        <Col xs={6} md={12} className="mb-2 mb-md-4 text-left ml-2 ml-md-0 text-md-center pt-1">
          <h3 className={cn(styles.neu)}>
            <img src={icon} className={cn(styles.icon, "mr-2 mb-1")} data-test-id="simple-neu" />
            0.0000 NEU
          </h3>
        </Col>
        <Col md={12} className="text-right text-md-center" data-test-id="arrow-neu">
          <Link to="#">
            <Button
              layout="secondary"
              iconPosition="icon-after"
              theme="t-white"
              svgIcon={arrowRight}
            >
              About NEU
            </Button>
          </Link>
        </Col>
      </Row>
    </div>
  ) : (
    <div className={cn(styles.background)}>
      <h5 className={cn(styles.title, "text-left mb-3 pl-2 pl-md-3 pt-2")}>MY NEUMARK</h5>
      <Row noGutters>
        <Col>
          <Row className="justify-content-md-center ml-3 ml-md-0" noGutters>
            <img src={icon} className={cn(styles.icon, "mr-2")} />
            <h3 className={cn("align-self-end", styles.neu)} data-test-id="balance-neu">
              <Money value={props.balanceNeu} currency="neu" doNotSeparateThousands />
            </h3>
          </Row>
          <Col md={12} xs={10} className="text-md-center pl-5 pl-md-0 ml-2">
            <p data-test-id="balance-eur" className={cn(styles.smaller)}>
              = <Money value={props.balanceEur!} currency="eur" doNotSeparateThousands />
            </p>
          </Col>
        </Col>
        <Col xs={5} md={12} className="align-self-end">
          <div className="text-right pr-2 pr-md-0 text-md-center pl-3">
            <p className={cn("mb-1", styles.smaller)}>Outstanding NEU</p>
            <p className={cn(styles.neuRatio, "pr-4")} data-test-id="ratio-neu">
              + <Money value={props.ratioNeu!} currency="neu" doNotSeparateThousands />
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};
