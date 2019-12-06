import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { ETokenType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { injectIntlHelpers } from "../../../../utils/injectIntlHelpers.unsafe";
import { appRoutes } from "../../../appRoutes";
import { InfoAlert } from "../../../shared/Alerts";
import { Button, ButtonInline, EButtonLayout } from "../../../shared/buttons";
import { Money } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode
} from "../../../shared/formatters/utils";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { MaskedNumberInput } from "../../../shared/MaskedNumberInput";
import { InvestmentPriceInfo } from "./InvestmentPriceInfo";
import { InvestmentTypeSelector } from "./InvestmentTypeSelector";
import { EInvestmentCurrency } from "./utils";

import * as styles from "./Investment.module.scss";
import { selectTxUserFlowInvestmentState } from "../../../../modules/tx/user-flow/investment/selectors";
import { EProcessState } from "../../../../utils/enums/processStates";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";

// TODO: Refactor smaller components
export const InvestmentSelectionComponent = ({
  changeInvestmentType,
  eto,
  gasCostEth,
  gasCostEuro,
  investmentType,
  minTicketEur,
  neuReward,
  readyToInvest,
  wallets,
  hasPreviouslyInvested,
  startUpgradeFlow,
  investmentCurrency,
  etoTokenGeneralDiscounts,
  etoTokenPersonalDiscount,
  etoTokenStandardPrice,
  totalCostEth,
  totalCostEuro,
  error,
  minEthTicketFormatted,
  equityTokenCountFormatted,
  euroValueWithFallback,
  investmentValue,

  sendTransaction,
  investEntireBalance,
  changeEuroValue,
  changeEthValue,
  intl,
}) => {
  console.log("render",error)
  return (
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
            currentType={investmentType}
            onSelect={changeInvestmentType}
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
            <p className={styles.investmentPriceInfo}>
              <InvestmentPriceInfo
                onChainState={eto.contract.timedState}
                etoTokenPersonalDiscount={etoTokenPersonalDiscount}
                etoTokenGeneralDiscounts={etoTokenGeneralDiscounts}
                etoTokenStandardPrice={etoTokenStandardPrice}
              />
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-right">
            {investmentCurrency === EInvestmentCurrency.EUR_TOKEN && (
              <MaskedNumberInput
                name="euroValue"
                value={investmentValue}
                storageFormat={ENumberInputFormat.ULPS}
                valueType={ECurrency.EUR_TOKEN}
                outputFormat={ENumberOutputFormat.FULL}
                onChangeFn={changeEuroValue}
                showUnits={true}
                data-test-id="invest-modal-eur-field"
                placeholder={`${intl.formatIntlMessage(
                  "investment-flow.min-ticket-size",
                )} ${minTicketEur} EUR`}
                errorMsg={error}
                invalid={!!error}
                // setError={setError}
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
                  onChangeFn={changeEthValue}
                  placeholder={`${intl.formatIntlMessage(
                    "investment-flow.min-ticket-size",
                  )} ${minEthTicketFormatted} ETH`}
                  data-test-id="invest-modal-eth-field"
                  showUnits={true}
                  errorMsg={error}
                  invalid={!!error}
                  // setError={setError}
                />
                {!error && <div className={styles.helpText}>
                  {"≈ "}
                  <Money
                    value={euroValueWithFallback}
                    inputFormat={ENumberInputFormat.FLOAT}
                    valueType={ECurrency.EUR}
                    outputFormat={ENumberOutputFormat.FULL}
                  />
                </div>}
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
                  {(equityTokenCountFormatted &&
                    `${equityTokenCountFormatted} ${eto.equityTokenSymbol}`) ||
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
                  {(neuReward && (
                    <Money
                      value={neuReward}
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
            {gasCostEth && (
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
            )}
            <div>
              <FormattedMessage id="investment-flow.total" />:{" "}
              <span className="text-warning" data-test-id="invest-modal-total-cost">
                  {investmentCurrency === EInvestmentCurrency.EUR_TOKEN && (
                    <Money
                      value={totalCostEuro}
                      inputFormat={ENumberInputFormat.ULPS}
                      valueType={ECurrency.EUR}
                      outputFormat={ENumberOutputFormat.FULL}
                    />
                  )}
                {investmentCurrency === EInvestmentCurrency.ETH && (
                  <>
                    <Money
                      value={totalCostEth}
                      inputFormat={ENumberInputFormat.ULPS}
                      outputFormat={ENumberOutputFormat.FULL}
                      valueType={ECurrency.ETH}
                    />
                    <span className={styles.helpText}>
                        {" ≈ "}
                      <Money
                        value={totalCostEuro}
                        inputFormat={ENumberInputFormat.ULPS}
                        valueType={ECurrency.EUR}
                        outputFormat={ENumberOutputFormat.FULL}
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
            onClick={sendTransaction}
            layout={EButtonLayout.OUTLINE}
            type="submit"
            disabled={!readyToInvest}
            data-test-id="invest-modal-invest-now-button"
          >
            <FormattedMessage id="investment-flow.invest-now" />
          </Button>
        </Row>
      </Container>
    </section>
  );
};

export const InvestmentSelection = compose(
  injectIntlHelpers,
  appConnect({
    stateToProps: state => {
      return { ...selectTxUserFlowInvestmentState(state) }
    },
    dispatchToProps: dispatch => ({
      sendTransaction: () => dispatch(actions.txSender.txSenderAcceptDraft()),
      changeEthValue: value => {
        console.log("changeEthValue",value)
        return dispatch(actions.txUserFlowInvestment.updateValue(value))
      },
      changeEuroValue: value =>
        dispatch(actions.txUserFlowInvestment.updateValue(value)),
      changeInvestmentType: (type: EInvestmentType) =>
        dispatch(actions.investmentFlow.selectInvestmentType(type)),
      investEntireBalance: () => dispatch(actions.investmentFlow.investEntireBalance()),
      startUpgradeFlow: (token: ETokenType) => dispatch(actions.txTransactions.startUpgrade(token)),
    }),
  }),
  branch(({ processState }) => {
      return processState !== EProcessState.SUCCESS
    },
    renderComponent(LoadingIndicator))
)(InvestmentSelectionComponent);
