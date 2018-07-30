import { Form, Formik, FormikProps } from "formik";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, FormGroup, Label, Row } from "reactstrap";

import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { IInitComponentProps } from "../../modals/txSender/TxSender";
import { InfoAlert } from "../../shared/Alerts";
import { Button } from "../../shared/Buttons";
import { FormFieldImportant } from "../../shared/forms/formField/FormFieldImportant";
import { Heading } from "../../shared/modals/Heading";
import { Money } from "../../shared/Money";
import { WalletSelector } from "./WalletSelector";

import * as neuIcon from "../../../assets/img/neu_icon.svg";
import * as tokenIcon from "../../../assets/img/token_icon.svg";
import * as styles from "./Investment.module.scss";

interface IFormState {
  value: number;
  wallet: string;
}

interface IStateProps {
  wallets: Array<{
    id: string;
    name: string;
    balanceEth: string;
    balanceEur?: string;
  }>;
}

interface IDispatchProps {
  submit: (values: IFormState) => void;
}

type IProps = IStateProps & IDispatchProps;

export const InvestmentSelectionForm = injectIntlHelpers(
  (props: FormikProps<IFormState> & IProps & IIntlProps) => {
    const failureTooltip = (
      <div>
        <p>
          <FormattedMessage id="investment-flow.amount-exceeds-investment" />
        </p>
        <Row>
          <Button theme="white" className="mr-4" type="submit">
            <FormattedMessage id="investment-flow.max-invest" />
          </Button>
        </Row>
      </div>
    );

    return (
      <Form>
        <Container className={styles.container}>
          <Row>
            <Heading>
              <FormattedMessage id="investment-flow.select-wallet-and-currency" />
            </Heading>
          </Row>
          <WalletSelector wallets={props.wallets} name="wallet" />
          <Row>
            <Heading>
              <FormattedMessage id="investment-flow.invest-funds" />
            </Heading>
          </Row>
          <FormGroup className={styles.investInput}>
            <Label>
              <FormattedMessage
                id="investment-flow.amount-input-label"
                values={{
                  transactionCost: (
                    <Money currency="eth" value="20000000000000000" theme="t-orange" />
                  ),
                }}
              />
            </Label>
            <FormFieldImportant
              name="amount"
              placeholder={props.intl.formatIntlMessage("investment-flow.min-ticket-size")}
              errorMessage={failureTooltip}
            />
            <a href="#" onClick={el => el.preventDefault()}>
              <FormattedMessage id="investment-flow.invest-entire-balance" />
            </a>
          </FormGroup>
          <Row className={styles.equals}>
            <span>=</span>
          </Row>
          <FormGroup>
            <Label>
              <img className={styles.icon} src={tokenIcon} />{" "}
              <FormattedMessage id="investment-flow.equity-tokens" />
            </Label>
            <InfoAlert>TODO: Autoconvert from invested amount</InfoAlert>
          </FormGroup>
          <FormGroup>
            <Label>
              <img className={styles.icon} src={neuIcon} />{" "}
              <FormattedMessage id="investment-flow.estimated-neu-tokens" />
            </Label>
            <InfoAlert>TODO: Autoconvert from invested amount</InfoAlert>
          </FormGroup>
          <Row className="justify-content-center">
            <Button layout="primary" className="mr-4" type="submit">
              <FormattedMessage id="investment-flow.invest" />
            </Button>
          </Row>
        </Container>
      </Form>
    );
  },
);

/**
 * @todo real wallet data is missing!
 */

const wallets = [
  {
    balanceEth: "300000000",
    id: "foo",
    name: "ICBM Wallet",
  },
  {
    balanceEth: "400000000",
    balanceEur: "456",
    id: "bar",
    name: "Light Wallet",
  },
];

export const InvestmentSelection: React.SFC<IInitComponentProps> = ({ onAccept }) => {
  return (
    <Formik<{}, IFormState>
      initialValues={{ wallet: wallets[0].name, value: 0 }}
      onSubmit={v => onAccept({ value: v.value })}
    >
      {(props: any) => <InvestmentSelectionForm {...props} wallets={wallets} />}
    </Formik>
  );
};
