import * as React from "react";
import { Col } from "reactstrap";

import { SectionHeader } from "../../shared/SectionHeader";

interface IProps {
  title: string | React.ReactNode;
  step?: number;
  "data-test-id"?: string;
}

export const DashboardSection: React.SFC<IProps> = ({
  title,
  step,
  "data-test-id": dataTestId,
}) => (
  <Col xs={12} data-test-id={dataTestId}>
    <SectionHeader className="my-4">
      {step && <>STEP {step}:</>} {title}
    </SectionHeader>
  </Col>
);
