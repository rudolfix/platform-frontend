import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";
import * as icon from "../../../assets/img/neu_icon.svg";
import { ArrowLink } from "../../shared/ArrowLink";
import { Money } from "../../shared/Money";
import * as styles from "./MyNeuWidget.module.scss";

interface IProps {
  balanceNeu: string;
  balanceEur?: string;
  ratioNeu?: string;
}

export const MyNeuWidget: React.SFC<IProps> = props => {
  return props.balanceNeu === "0" ? (
    <div className={cn(styles.background)}>
      <h5 className="text-light text-left mb-3 mb-md-5 pl-3 pt-1">YOUR NEUMARK</h5>
      <Row noGutters>
        <Col md={12}>
          <h3 className="text-light mb-4 mb-md-5 text-left ml-3 ml-md-0 text-md-center">
            <img src={icon} className={cn(styles.icon, "mr-2 mb-1")} data-test-id="simple-neu" />
            0.0000 NEU
          </h3>
        </Col>
        <Col md={12} className="text-right text-md-center" data-test-id="arrow-neu">
          <ArrowLink arrowDirection="right" to="#" className="text-light">
            About NEU
          </ArrowLink>
        </Col>
      </Row>
    </div>
  ) : (
    <div className={cn(styles.background)}>
      <h5 className="text-light text-left mb-3 pl-3 pt-1">YOUR NEUMARK</h5>
      <Row noGutters>
        <Col>
          <Row className="text-light justify-content-md-center ml-3 ml-md-0" noGutters>
            <img src={icon} className={cn(styles.icon, "mr-2")} />
            <h3 className="text-light" data-test-id="balance-neu">
              <Money value={props.balanceNeu} currency="neu" doNotSeparateThousands />
            </h3>
          </Row>
          <Col md={12} xs={10} className="text-light text-md-center pl-5 pl-md-0 ml-2">
            <p data-test-id="balance-eur">
              = <Money value={props.balanceEur!} currency="eur" doNotSeparateThousands />
            </p>
          </Col>
        </Col>
        <Col xs={5} md={12}>
          <div className="text-light text-right pr-2 pr-md-0 text-md-center pl-3">
            <p className="mb-1">Outstanding NEU</p>
            <p className={cn(styles.ratio, "pr-4")} data-test-id="ratio-neu">
              + <Money value={props.ratioNeu!} currency="neu" doNotSeparateThousands />
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};
