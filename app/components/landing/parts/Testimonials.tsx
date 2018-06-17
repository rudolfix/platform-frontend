import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./Testimonials.module.scss";

export const Testimonials: React.SFC = () => (
  <section>
    <Container>
      <Row>
        <Col>
          <div className={styles.media} />
        </Col>
      </Row>
    </Container>
  </section>
);
