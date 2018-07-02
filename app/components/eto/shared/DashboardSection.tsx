import * as React from "react";
import { Col, Row } from "reactstrap";

import { SectionHeader } from "../../shared/SectionHeader";

interface IProps {
  title: string;
  children: React.ReactNode;
  step?: number;
  "data-test-id"?: string;
}

export const DashboardSection: React.SFC<IProps> = ({
  title,
  children,
  step,
  "data-test-id": dataTestId,
}) => (
  <>
    <Row data-test-id={dataTestId}>
      <Col lg={8} xs={12}>
        <SectionHeader className="my-4">
          {step && <>STEP {step}:</>} {title}
        </SectionHeader>
      </Col>
    </Row>
    <Row>{children}</Row>
  </>
);
