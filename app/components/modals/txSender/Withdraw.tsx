import { Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { SpinningEthereum } from "../../landing/parts/SpinningEthereum";
import { Button } from "../../shared/Buttons";
import { FormFieldImportant } from "../../shared/forms/formField/FormFieldImportant";

import * as styles from "./Withdraw.module.scss";

export const Withdraw = () => (
  <div>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik initialValues={{}} onSubmit={() => {}}>
      {() => (
        <Row>
          <Col xs={12} className="mb-3">
            <FormFieldImportant
              name=""
              label={<FormattedMessage id="modal.sent-eth.to-address" />}
            />
          </Col>
          <Col xs={12} className="mb-3">
            <FormFieldImportant
              name=""
              label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
            />
          </Col>
          <Col xs={12} className="mb-4">
            <FormFieldImportant
              name=""
              label={<FormattedMessage id="modal.sent-eth.gas-limit" />}
            />
          </Col>
          <Col xs={12} className="text-center">
            <Button type="submit">
              <FormattedMessage id="modal.sent-eth.button" />
            </Button>
          </Col>
        </Row>
      )}
    </Formik>
  </div>
);
