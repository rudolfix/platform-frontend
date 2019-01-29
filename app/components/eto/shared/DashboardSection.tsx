import * as React from "react";
import { Col } from "reactstrap";

import { ESectionHeaderSize, SectionHeader } from "../../shared/SectionHeader";

interface IProps {
  title: string | React.ReactNode;
  step?: number;
  "data-test-id"?: string;
  hasDecorator?: boolean;
  className?: string;
  size?: ESectionHeaderSize;
}

const DashboardSection: React.FunctionComponent<IProps> = ({
  title,
  step,
  "data-test-id": dataTestId,
  hasDecorator,
  className = "my-4",
  size,
}) => (
  <Col xs={12} data-test-id={dataTestId}>
    <SectionHeader className={className} layoutHasDecorator={hasDecorator} size={size}>
      {step && <>STEP {step}:</>} {title}
    </SectionHeader>
  </Col>
);

export { DashboardSection };
