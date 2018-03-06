import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./Demo.module.scss";

import { PanelWhite } from "./shared/PanelWhite";

export const Demo: React.SFC = () => (
  <Container>
    <Container className={styles.demo}>
      <Row>
        <Col>
          <PanelWhite>
            <p className="mt-2">
              So this is our white panel. It can contain React.Nodes as children and no Props:
            </p>
            <dl>
              <dt>headerText: string</dt>
              <dd>Title of panel it will be rendered in span element</dd>
              <dt>rightComponent: ReactNode</dt>
              <dd>Component that will be put in header on right side.</dd>
            </dl>
          </PanelWhite>
        </Col>
      </Row>
    </Container>
  </Container>
);
