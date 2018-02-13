import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { appRoutes } from "../AppRouter";
import * as styles from "./LayoutRegisterLogin.module.scss";

export const LayoutRegisterLogin: React.SFC = ({ children }) => (
  <Container>
    <Link to={appRoutes.root} className={styles.logo} />
    <Row>
      <Col lg="12" xl={{ size: "10", offset: 1 }} className={cn("p-5", styles.mainContainer)}>
        {children}
      </Col>
    </Row>
  </Container>
);
