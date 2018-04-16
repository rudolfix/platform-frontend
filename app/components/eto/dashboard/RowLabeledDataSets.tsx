import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./RowLabeledDataSets.module.scss";

interface IData {
  title: string | React.ReactNode;
  content: string | string[] | number | number[];
}

interface IProps {
  dataSets: IData[];
}

export const RowLabeledDataSets: React.SFC<IProps> = ({ dataSets }) => {
  return (
    <>
      {dataSets.map(({ title, content }, index) => (
        <Row className={index !== 0 ? "mt-3" : ""}>
          <Col className={styles.label} xs={12} md={5}>
            {title}
          </Col>
          <Col xs={12} md={7}>
            {content instanceof Array ? content.join(', ') : content}
          </Col>
        </Row>
      ))}
    </>
  );
};
