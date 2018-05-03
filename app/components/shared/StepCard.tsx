import * as React from "react";
import { Col, Row } from "reactstrap";

interface IStepCardProps {
  img: string;
  text: string | React.ReactNode;
}
export const StepCard: React.SFC<IStepCardProps> = ({ img, text }) => (
  <Col sm={4} xs={12} className="mb-4 mb-sm-0">
    <Row>
      <Col>
        <img src={img} className="mb-3" />
      </Col>
    </Row>
    <Row>
      <Col>{text}</Col>
    </Row>
  </Col>
);
