import * as React from "react";
import { Col, Row } from "reactstrap";

import { InlineIcon } from "../../shared/InlineIcon";
import { SectionHeader } from "../../shared/SectionHeader";

import * as editIcon from "../../../assets/img/inline_icons/edit.svg";

interface IProps {
  title: string;
  children: React.ReactNode;
  step?: number;
}

export const DashboardSection: React.SFC<IProps> = ({ title, children, step }) => (
  <>
    <Row>
      <Col lg={8} xs={12}>
        <SectionHeader className="my-4">
          {step && <>STEP {step}:</>} {title}
          <InlineIcon onClick={() => {}} svgIcon={editIcon} />
        </SectionHeader>
      </Col>
    </Row>
    <Row>{children}</Row>
  </>
);
