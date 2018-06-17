import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import Carousel from "nuka-carousel";

import * as styles from "./Testimonials.module.scss";

export const Testimonials: React.SFC = () => (
  <section>
    <Container>
      <Row>
        <Col>
          <div className={styles.media}>
            <Carousel>
              <div>#1</div>
              <div>#2</div>
              <div>#3</div>
            </Carousel>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);
