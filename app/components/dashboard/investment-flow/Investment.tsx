import { Form } from 'formik'
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { InfoAlert } from "../../shared/Alerts";
import { FormField } from "../../shared/forms/forms";
import { Money } from "../../shared/Money";
import { WalletSelector } from './WalletSelector'

interface IProps {
  stateValues: {
    amount: number
  }
}

export const InvestmentSelectionForm: React.SFC<IProps> = () => (
  <Form>
    <h4><FormattedMessage id="investment-flow.select-wallet-and-currency" /></h4>
    <WalletSelector></WalletSelector>
    <h4><FormattedMessage id="investment-flow.invest-funds" /></h4>
    <FormField name="amount" label={
      <FormattedMessage id="investment-flow.amount-input-label" values={{ transactionCost: (<Money currency="eth" value="20000000000000000" theme="t-orange" />) }} />
    } />
    <a><FormattedMessage id="investment-flow.invest-entire-balance"/></a>
    <div>
    <strong>=</strong>
    </div>
    <label><img /> <FormattedMessage id="investment-flow.equity-tokens"/></label>
    <InfoAlert >TODO: Autoconvert from invested amount</InfoAlert>
    <label><img /> <FormattedMessage id="investment-flow.estimated-neu-tokens"/></label>
    <InfoAlert >TODO: Autoconvert from invested amount</InfoAlert>
  </Form>
)

