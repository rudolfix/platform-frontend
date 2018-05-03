import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./HeaderProgressStepper.module.scss";
import { ProgressStepper } from "./ProgressStepper";

interface IProps {
  steps: number;
  currentStep: number;
  headerText: string | React.ReactNode;
  descText?: string | React.ReactNode;
  warning?: boolean;
}

export const HeaderProgressStepper: React.SFC<IProps> = props => (
  <>
    <Row className="mb-2">
      <Col>
        <ProgressStepper steps={props.steps} currentStep={props.currentStep} />
      </Col>
    </Row>
    <Row className="mt-4 mb-5 text-center">
      <Col>
        <h2 className={cn("font-weight-bold", props.warning && styles.warning)}>
          {props.headerText}
        </h2>
        {props.descText && <p className="pt-3">{props.descText}</p>}
      </Col>
    </Row>
  </>
);
