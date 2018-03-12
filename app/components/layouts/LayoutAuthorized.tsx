import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorizedMenu } from "./LayoutAuthorizedMenu";

import * as styles from "./LayoutAuthorized.module.scss";

export const LayoutAuthorized: React.SFC = ({ children }) => (
  <>
    <div className={styles.menu}>
      <LayoutAuthorizedMenu />
    </div>
    <div className="layout-container">
      <Row>
        <Col className={styles.content}>{children}</Col>
      </Row>
    </div>
  </>
);
