import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorizedMenu } from "./LayoutAuthorizedMenu";

import { NotificationWidget } from "../dashboard/notification-widget/NotificationWidget";
import * as styles from "./LayoutAuthorized.module.scss";

export const LayoutAuthorized: React.SFC = ({ children }) => (
  <>
    <div>
      <LayoutAuthorizedMenu />
    </div>
    <div className="layout-container">
      <Row>
        <Col className={styles.content}>
          <NotificationWidget />
          {children}
        </Col>
      </Row>
    </div>
  </>
);
