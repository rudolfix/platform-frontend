import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { EETOStateOnChain, IEtoTokenGeneralDiscounts } from "../../../../modules/eto/types";
import { IPersonalDiscount } from "../../../../modules/investor-portfolio/types";
import { ETokenType } from "../../../../modules/tx/types";
import { selectTxUserFlowInvestmentState } from "../../../../modules/tx/user-flow/investment/selectors";
import {
  EInvestmentCurrency,
  EInvestmentFormState,
  EInvestmentWallet,
  TTxUserFlowInvestmentState,
  TTxUserFlowInvestmentViewData,
} from "../../../../modules/tx/user-flow/investment/types";
import { appConnect } from "../../../../store";
import { EProcessState } from "../../../../utils/enums/processStates";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers.unsafe";
import { appRoutes } from "../../../appRoutes";
import { InfoAlert } from "../../../shared/Alerts";
import { Button, ButtonInline, EButtonLayout } from "../../../shared/buttons";
import { Money } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
} from "../../../shared/formatters/utils";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { MaskedNumberInput } from "../../../shared/MaskedNumberInput";
import { getMessageTranslation } from "../../../translatedMessages/messages";
import { InvestmentPriceInfo } from "./InvestmentPriceInfo";
import { InvestmentTypeSelector } from "./InvestmentTypeSelector";

import * as styles from "./Investment.module.scss";

type TDispatchProps = {
  submitInvestment: () => void;
  changeInvestmentValue: (value: string) => void;
  changeInvestmentWallet: (type: EInvestmentWallet) => void;
  investEntireBalance: () => void;
  startUpgradeFlow: (token: ETokenType) => void;
};
// TODO: Refactor smaller components

type TInvestmentTotalsProps = {
  gasCostEth: string;
  gasCostEuro: string;
};

export const InvestmentTotals = ({ gasCostEth, gasCostEuro }: TInvestmentTotalsProps) => (
  <div>
    + <FormattedMessage id="investment-flow.estimated-gas-cost" />:{" "}
    <span className="text-warning" data-test-id="invest-modal-gas-cost">
      <Money
        value={gasCostEth}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.ETH}
        roundingMode={ERoundingMode.UP}
      />
      <span className={styles.helpText}>
        {" ≈ "}
        <Money
          value={gasCostEuro}
          inputFormat={ENumberInputFormat.ULPS}
          outputFormat={ENumberOutputFormat.FULL}
          valueType={ECurrency.EUR}
          roundingMode={ERoundingMode.UP}
        />
      </span>
    </span>
  </div>
);

type TInvestmentPriceInfoProps = {
  timedState: EETOStateOnChain;
  etoTokenPersonalDiscount: IPersonalDiscount;
  etoTokenGeneralDiscounts: IEtoTokenGeneralDiscounts;
  etoTokenStandardPrice: string;
};

export const InvestmentPrice = ({
  timedState,
  etoTokenPersonalDiscount,
  etoTokenGeneralDiscounts,
  etoTokenStandardPrice,
}: TInvestmentPriceInfoProps) => (
  <p className={styles.investmentPriceInfo}>
    <InvestmentPriceInfo
      onChainState={timedState}
      etoTokenPersonalDiscount={etoTokenPersonalDiscount}
      etoTokenGeneralDiscounts={etoTokenGeneralDiscounts}
      etoTokenStandardPrice={etoTokenStandardPrice}
    />
  </p>
);

export const InvestmentSelectionComponent: React.FunctionComponent<TTxUserFlowInvestmentViewData &
  TDispatchProps &
  IIntlProps> = ({
  submitInvestment,
  investEntireBalance,
  changeInvestmentValue,
  intl,

  changeInvestmentWallet,
  eto,
  investmentWallet,
  minTicketEur,
  wallets,
  hasPreviouslyInvested,
  startUpgradeFlow,
  investmentCurrency,
  totalCostEth,
  totalCostEuro,
  minEthTicketFormatted,
  euroValueWithFallback,
  investmentValue,
  etoTokenGeneralDiscounts,
  etoTokenPersonalDiscount,
  etoTokenStandardPrice,
  ...rest
}) => (
  <section data-test-id="modals.investment.modal">
    <Container className={styles.container} fluid>
      <Row className="mt-0">
        <Col>
          <Heading size={EHeadingSize.SMALL} level={4}>
            <FormattedMessage id="investment-flow.select-wallet-and-currency" />
          </Heading>
        </Col>
      </Row>
      <Row>
        <InvestmentTypeSelector
          wallets={wallets}
          currentType={investmentWallet}
          onSelect={changeInvestmentWallet}
          startUpgradeFlow={startUpgradeFlow}
        />
      </Row>
      <Row>
        <Col>
          <Heading size={EHeadingSize.SMALL} level={4}>
            <FormattedMessage id="investment-flow.calculate-investment" />
          </Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          {eto.contract && (
            <InvestmentPrice
              timedState={eto.contract.timedState}
              etoTokenGeneralDiscounts={etoTokenGeneralDiscounts}
              etoTokenPersonalDiscount={etoTokenPersonalDiscount}
              etoTokenStandardPrice={etoTokenStandardPrice}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col className="text-right">
          {investmentCurrency === EInvestmentCurrency.EUR_TOKEN && (
            <MaskedNumberInput
              name="euroValue"
              value={investmentValue}
              storageFormat={ENumberInputFormat.FLOAT}
              valueType={ECurrency.EUR_TOKEN}
              outputFormat={ENumberOutputFormat.FULL}
              onChangeFn={changeInvestmentValue}
              showUnits={true}
              data-test-id="invest-modal-eur-field"
              placeholder={`${intl.formatIntlMessage(
                "investment-flow.min-ticket-size",
              )} ${minTicketEur} EUR`}
              errorMsg={
                rest.formState === EInvestmentFormState.INVALID
                  ? getMessageTranslation(rest.error)
                  : undefined
              }
              invalid={rest.formState === EInvestmentFormState.INVALID}
            />
          )}
          {investmentCurrency === EInvestmentCurrency.ETH && (
            <>
              <MaskedNumberInput
                name="ethValue"
                value={investmentValue}
                valueType={ECurrency.ETH}
                storageFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.FULL}
                onChangeFn={changeInvestmentValue}
                placeholder={`${intl.formatIntlMessage(
                  "investment-flow.min-ticket-size",
                )} ${minEthTicketFormatted} ETH`}
                data-test-id="invest-modal-eth-field"
                showUnits={true}
                errorMsg={
                  rest.formState === EInvestmentFormState.INVALID
                    ? getMessageTranslation(rest.error)
                    : undefined
                }
                invalid={rest.formState === EInvestmentFormState.INVALID}
              />
              {rest.formState !== EInvestmentFormState.INVALID && (
                <div className={styles.helpText}>
                  {"≈ "}
                  <Money
                    value={
                      rest.formState !== EInvestmentFormState.VALID
                        ? undefined
                        : euroValueWithFallback
                    }
                    inputFormat={ENumberInputFormat.FLOAT}
                    valueType={ECurrency.EUR}
                    outputFormat={ENumberOutputFormat.FULL}
                    defaultValue={"-"}
                  />
                </div>
              )}
            </>
          )}
          <small>
            <ButtonInline
              className={cn(styles.investAll, "text-right")}
              data-test-id="invest-modal-full-balance-btn"
              onClick={investEntireBalance}
            >
              <FormattedMessage id="investment-flow.invest-entire-balance" />
            </ButtonInline>
          </small>
        </Col>
      </Row>
    </Container>
    <section className={styles.green}>
      <Container className={styles.container}>
        <Row>
          <Col>
            <p className="mb-0">
              <FormattedMessage id="investment-flow.you-will-receive" />
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label>
                <FormattedMessage id="investment-flow.equity-tokens" />
              </Label>
              <InfoAlert data-test-id="invest-modal.est-equity-tokens">
                {(rest.formState === EInvestmentFormState.VALID &&
                  `${rest.equityTokenCountFormatted} ${eto.equityTokenSymbol}`) ||
                  "\xA0" /* non breaking space*/}
              </InfoAlert>
            </FormGroup>
          </Col>
          <Col sm="1" />
          <Col>
            <FormGroup>
              <Label>
                <FormattedMessage id="investment-flow.estimated-neu-tokens" />
              </Label>
              <InfoAlert data-test-id="invest-modal.est-neu-tokens">
                {(rest.formState === EInvestmentFormState.VALID && (
                  <Money
                    value={rest.neuReward}
                    inputFormat={ENumberInputFormat.ULPS}
                    valueType={ECurrency.NEU}
                    outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                  />
                )) ||
                  "\xA0"}
              </InfoAlert>
            </FormGroup>
          </Col>
        </Row>
        {hasPreviouslyInvested && (
          <Row>
            <Col>
              <p className="mb-0 mt-0">
                <FormattedMessage id="investment-flow.you-already-invested" />
                <br />
                <Link to={appRoutes.portfolio}>
                  <FormattedMessage id="investment-flow.see-your-portfolio-for-details" />
                </Link>
              </p>
            </Col>
          </Row>
        )}
      </Container>
    </section>
    <Container className={styles.container} fluid>
      <Row>
        <Col className={styles.summary}>
          {rest.formState === EInvestmentFormState.VALID && <InvestmentTotals {...rest} />}
          <div>
            <FormattedMessage id="investment-flow.total" />:{" "}
            <span className="text-warning" data-test-id="invest-modal-total-cost">
              {investmentCurrency === EInvestmentCurrency.EUR_TOKEN && (
                <Money
                  value={rest.formState !== EInvestmentFormState.VALID ? undefined : totalCostEuro}
                  inputFormat={ENumberInputFormat.ULPS}
                  valueType={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.FULL}
                  defaultValue={"-"}
                />
              )}
              {investmentCurrency === EInvestmentCurrency.ETH && (
                <>
                  <Money
                    value={rest.formState !== EInvestmentFormState.VALID ? undefined : totalCostEth}
                    inputFormat={ENumberInputFormat.ULPS}
                    outputFormat={ENumberOutputFormat.FULL}
                    valueType={ECurrency.ETH}
                    defaultValue={"-"}
                  />
                  <span className={styles.helpText}>
                    {" ≈ "}
                    <Money
                      value={
                        rest.formState !== EInvestmentFormState.VALID ? undefined : totalCostEuro
                      }
                      inputFormat={ENumberInputFormat.ULPS}
                      valueType={ECurrency.EUR}
                      outputFormat={ENumberOutputFormat.FULL}
                      defaultValue={"-"}
                    />
                  </span>
                </>
              )}
            </span>
          </div>
        </Col>
      </Row>
    </Container>
    <Container>
      <Row className="justify-content-center mb-0">
        <Button
          onClick={submitInvestment}
          layout={EButtonLayout.OUTLINE}
          type="submit"
          disabled={rest.formState !== EInvestmentFormState.VALID}
          data-test-id="invest-modal-invest-now-button"
        >
          <FormattedMessage id="investment-flow.invest-now" />
        </Button>
      </Row>
    </Container>
  </section>
);

export const InvestmentSelection = compose<
  TTxUserFlowInvestmentViewData & TDispatchProps & IIntlProps,
  {}
>(
  injectIntlHelpers,
  appConnect<TTxUserFlowInvestmentState, TDispatchProps>({
    stateToProps: state => ({ ...selectTxUserFlowInvestmentState(state) }),
    dispatchToProps: dispatch => ({
      submitInvestment: () => dispatch(actions.txUserFlowInvestment.submitInvestment()),
      changeInvestmentValue: value => dispatch(actions.txUserFlowInvestment.updateValue(value)),
      changeInvestmentWallet: (type: EInvestmentWallet) =>
        dispatch(actions.txUserFlowInvestment.changeInvestmentWallet(type)),
      investEntireBalance: () => dispatch(actions.txUserFlowInvestment.investEntireBalance()),
      startUpgradeFlow: (token: ETokenType) => dispatch(actions.txTransactions.startUpgrade(token)),
    }),
  }),
  branch<TTxUserFlowInvestmentState>(
    ({ processState }) => processState !== EProcessState.SUCCESS,
    renderComponent(LoadingIndicator),
  ),
)(InvestmentSelectionComponent);
