import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { IGasState } from "../../../../modules/gas/reducer";
import { ITxData } from "../../../../modules/tx/sender/reducer";
import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";
import { Button } from "../../../shared/Buttons";
import { FormFieldImportant } from "../../../shared/forms/formField/FormFieldImportant";

import { appConnect } from "../../../../store";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { LoadingIndicator } from "../../../shared/LoadingIndicator";
import { WarningAlert } from "../../../shared/WarningAlert";
import * as styles from "./Withdraw.module.scss";

interface IWithdrawOwnProps {
  onAccept: (tx: Partial<ITxData>) => any;
}

interface IWithdrawStateProps {
  gas: IGasState;
}

export const WithdrawComponent: React.SFC<IWithdrawOwnProps & IWithdrawStateProps> = ({
  onAccept,
  gas,
}) => (
  <div>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik
      initialValues={{ gas: "21000" }}
      onSubmit={data => onAccept({ ...data, gasPrice: gas.gasPrice!.standard })}
    >
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
            <Col xs={12} className="mb-4">
              <FormLabel>
                <FormattedMessage id="modal.sent-eth.gas-price" />
              </FormLabel>
              <GasComponent {...gas} />
            </Col>
            <Col xs={12} className="text-center">
              <Button type="submit" disabled={gas.loading && !gas.error}>
                <FormattedMessage id="modal.sent-eth.button" />
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  </div>
);

export const GasComponent: React.SFC<IGasState> = ({ gasPrice, error }) => {
  if (error) {
    return (
      <WarningAlert>
        <FormattedMessage id="tx-sender.withdraw.error" />
      </WarningAlert>
    );
  }

  if (gasPrice) {
    return <div>{gasPrice.standard}</div>;
  }

  return <LoadingIndicator light />;
};

export const Withdraw = appConnect<IWithdrawStateProps, {}, IWithdrawOwnProps>({
  stateToProps: state => ({
    gas: state.gas,
  }),
})(WithdrawComponent);
