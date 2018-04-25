import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { Button } from "../../shared/Buttons";
import { Money } from "../../shared/Money";

import { FormattedMessage } from "react-intl";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as icon from "../../../assets/img/neu_icon.svg";
import * as styles from "./MyNeuWidget.module.scss";

interface IProps {
  balanceNeu: string;
  balanceEur?: string;
}

export const MyNeuWidget: React.SFC<IProps> = props => {
  return props.balanceNeu === "0" ? (
    <div className={cn(styles.background, "h-100")}>
      <h5 className={cn(styles.title, "text-left mb-3 mb-md-5 pl-3 pt-1")}>
        <FormattedMessage id="dashboard.my-neu-widget.your-neumark" />
      </h5>
      <Row noGutters>
        <Col xs={6} md={12} className="mb-2 mb-md-4 text-left ml-2 ml-md-0 text-md-center pt-1">
          <h3 className={cn(styles.neu)}>
            <img src={icon} className={cn(styles.icon, "mr-2 mb-1")} data-test-id="simple-neu" />
            0.0000 NEU
          </h3>
        </Col>
        <Col md={12} className="text-right text-md-center" data-test-id="arrow-neu">
          <Button layout="secondary" iconPosition="icon-after" theme="t-white" svgIcon={arrowRight}>
            <FormattedMessage id="dashboard.my-neu-widget.about" />
          </Button>
        </Col>
      </Row>
    </div>
  ) : (
    <div className={cn(styles.background, "h-100")}>
      <h5 className={cn(styles.title, "text-left mb-3 pl-2 pl-md-3 pt-2")}>
        <FormattedMessage id="dashboard.my-neu-widget.my-neu" />
      </h5>
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
      </Row>
    </div>
  );
};
