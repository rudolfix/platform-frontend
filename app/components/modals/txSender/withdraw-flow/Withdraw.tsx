import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Button } from "../../../shared/Buttons";
import { FormFieldImportant } from "../../../shared/forms/formField/FormFieldImportant";

import { ITxData } from "../../../../modules/tx/sender/reducer";
import * as styles from "./Withdraw.module.scss";

interface IWithdrawProps {
  onAccept: (tx: Partial<ITxData>) => any;
}

export const Withdraw: React.SFC<IWithdrawProps> = ({ onAccept }) => (
  <div>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik initialValues={{ gas: "21000" }} onSubmit={onAccept}>
      {() => (
        <Form>
          <Row>
            <Col xs={12} className="mb-3">
              <FormFieldImportant
                name="to"
                label={<FormattedMessage id="modal.sent-eth.to-address" />}
                placeholder="0x0"
              />
            </Col>
            <Col xs={12} className="mb-3">
              <FormFieldImportant
                name="value"
                label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                placeholder="1000"
              />
            </Col>
            <Col xs={12} className="mb-4">
              <FormFieldImportant
                name="gas"
                label={<FormattedMessage id="modal.sent-eth.gas-limit" />}
              />
            </Col>
            <Col xs={12} className="text-center">
              <Button type="submit">
                <FormattedMessage id="modal.sent-eth.button" />
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  </div>
);
