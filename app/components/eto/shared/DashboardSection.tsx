import * as React from "react";
import { Col } from "reactstrap";

import { SectionHeader } from "../../shared/SectionHeader";

interface IProps {
  title: string | React.ReactNode;
  step?: number;
  "data-test-id"?: string;
  hasDecorator?: boolean;
}

export const DashboardSection: React.SFC<IProps> = ({
  title,
  step,
  "data-test-id": dataTestId,
  hasDecorator,
}) => (
  <Col xs={12} data-test-id={dataTestId}>
    <SectionHeader className="my-4" hasDecorator={hasDecorator}>
      {step && <>STEP {step}:</>} {title}
    </SectionHeader>
  </Col>
);
