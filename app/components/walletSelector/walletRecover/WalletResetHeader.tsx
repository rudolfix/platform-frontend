import * as React from "react";
import { Col } from "reactstrap";

import { ProgressStepper } from "../../shared/ProgressStepper";

interface IProps {
  steps: number;
  currentStep: number;
  text: string;
}

export const WalletResetHeader: React.SFC<IProps> = props => (
  <div>
    <Col className="mb-2">
      <ProgressStepper steps={props.steps} currentStep={props.currentStep} />
    </Col>
    <Col className="mt-4 mb-5 mx-auto text-center">
      <h2 className="font-weight-bold">Reset your Password</h2>
      <p className="pt-3">{props.text}</p>
    </Col>
  </div>
);
