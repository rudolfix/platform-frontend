import {
  Button,
  ButtonInline,
  EButtonLayout,
  Eth,
  Eur,
  EurToken,
  Neu,
} from "@neufund/design-system";
import {
  EEtoState,
  etoModuleApi,
  IEtoTokenGeneralDiscounts,
  InvalidETOStateError,
  investorPortfolioModuleApi,
  IPersonalDiscount,
  TEtoWithCompanyAndContractTypeChecked,
} from "@neufund/shared-modules";
import {
  addBigNumbers,
  compareBigNumbers,
  convertFromUlps,
  convertToUlps,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  formatThousands,
  multiplyBigNumbers,
  nonNullable,
  selectDecimalPlaces,
  TBigNumberVariants,
} from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";
import { compose, withProps } from "recompose";

import { actions } from "../../../../modules/actions";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import {
  selectInvestmentErrorState,
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValue,
  selectInvestmentType,
  selectIsInvestmentInputValidated,
  selectIsReadyToInvest,
  selectWallets,
} from "../../../../modules/investment-flow/selectors";
import {
  selectEtherPriceEur,
  selectEurPriceEther,
} from "../../../../modules/shared/tokenPrice/selectors";
import { selectTxGasCostEthUlps } from "../../../../modules/tx/sender/selectors";
import { ETokenType } from "../../../../modules/tx/types";
import { EValidationState } from "../../../../modules/tx/validator/reducer";
import { selectTxValidationState } from "../../../../modules/tx/validator/selectors";
import { isValidFormNumber } from "../../../../modules/tx/validator/transfer/utils";
import { appConnect } from "../../../../store";
import { appRoutes } from "../../../appRoutes";
import { InfoAlert } from "../../../shared/Alerts";
import { MaskedNumberInput } from "../../../shared/forms";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { IIntlProps, injectIntlHelpers } from "../../../shared/hocs/injectIntlHelpers.unsafe";
import { InvestmentPriceInfo } from "./InvestmentPriceInfo";
import { InvestmentTypeSelector, WalletSelectionData } from "./InvestmentTypeSelector";
import {
  EInvestmentCurrency,
  formatMinMaxTickets,
  getInputErrorMessage,
  getInvestmentCurrency,
} from "./utils";

import * as styles from "./Investment.module.scss";

interface IStateProps {
  eto: TEtoWithCompanyAndContractTypeChecked;
  wallets: readonly WalletSelectionData[];
  euroValue: string;
  ethValue: string;
  etherPriceEur: string;
  eurPriceEther: string;
  investmentType: EInvestmentType;
  gasCostEth: string;
  errorState?: EInvestmentErrorState;
  txValidationState?: EValidationState;
  equityTokenCount?: string;
  neuReward?: string;
  readyToInvest: boolean;
  showTokens: boolean;
  hasPreviouslyInvested?: boolean;
  etoTicketSizes?: {
    minTicketEurUlps: TBigNumberVariants;
    maxTicketEurUlps: TBigNumberVariants;
  };
  etoTokenGeneralDiscounts: IEtoTokenGeneralDiscounts;
  etoTokenPersonalDiscount: IPersonalDiscount;
  etoTokenStandardPrice: number;
}

interface IDispatchProps {
  sendTransaction: () => void;
  changeEuroValue: (value: string) => void;
  changeEthValue: (value: string) => void;
  changeInvestmentType: (type: EInvestmentType) => void;
  investEntireBalance: () => void;
  startUpgradeFlow: (token: ETokenType) => void;
}

interface IWithProps {
  gasCostEuro: string;
  minTicketEth: string;
  minTicketEur: string;
  maxTicketEur: string;
  investmentCurrency: EInvestmentCurrency;
}

type IProps = IStateProps & IDispatchProps & IIntlProps & IWithProps;

interface IState {
  validationError: boolean;
}

// TODO: Refactor smaller components
export class InvestmentSelectionComponent extends React.Component<IProps, IState> {
  state = { validationError: false };

  calculateTotalCostIfValid = (gasCost: string, value: string): string | null =>
    this.getError() ? null : addBigNumbers([gasCost, value || "0"]);

  setError = (hasError: boolean) => {
    this.setState({ validationError: hasError });
  };

  getError = () => {
    const externalError = getInputErrorMessage(
      this.props.errorState,
      this.props.txValidationState,
      this.props.eto.equityTokenName,
      this.props.maxTicketEur,
      this.props.minTicketEur,
      this.props.minTicketEth,
      this.props.investmentCurrency,
    );

    const validationError = this.state.validationError ? (
      <FormattedMessage id="investment-flow.validation-error" />
    ) : (
      undefined
    );

    return validationError || externalError;
  };

  investEntireBalance = () => {
    this.setError(false);
    this.props.investEntireBalance();
  };

  walletHasFunds = () => {
    const selectedWallet = this.props.wallets.find(
      (wallet: WalletSelectionData) => wallet.type === this.props.investmentType,
    );
    return selectedWallet !== undefined
      ? compareBigNumbers(selectedWallet.balanceEur, "0") > 0
      : false;
  };

  render(): React.ReactNode {
    const {
      changeInvestmentType,
      equityTokenCount,
      ethValue,
      eto,
      euroValue,
      gasCostEth,
      gasCostEuro,
      intl,
      investmentType,
      minTicketEth,
      minTicketEur,
      neuReward,
      readyToInvest,
      sendTransaction,
      showTokens,
      wallets,
      hasPreviouslyInvested,
      startUpgradeFlow,
      investmentCurrency,
      etoTokenGeneralDiscounts,
      etoTokenPersonalDiscount,
      etoTokenStandardPrice,
    } = this.props;
    const error = this.getError();
    const euroValueUlps = convertToUlps(euroValue || "0");

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
                  wrapperClassName="mb-0"
                  name="euroValue"
                  value={euroValueUlps}
                  storageFormat={ENumberInputFormat.ULPS}
                  valueType={ECurrency.EUR_TOKEN}
                  outputFormat={ENumberOutputFormat.FULL}
                  onChangeFn={this.props.changeEuroValue}
                  showUnits={true}
                  data-test-id="invest-modal-eur-field"
                  placeholder={`${intl.formatIntlMessage(
                    "investment-flow.min-ticket-size",
                  )} ${minTicketEur} EUR`}
                  errorMsg={error}
                  invalid={!!error}
                  setError={this.setError}
                />
              )}
              {investmentCurrency === EInvestmentCurrency.ETH && (
                <>
                  <MaskedNumberInput
                    wrapperClassName="mb-0"
                    name="ethValue"
                    valueType={ECurrency.ETH}
                    storageFormat={ENumberInputFormat.ULPS}
                    outputFormat={ENumberOutputFormat.FULL}
                    value={this.props.ethValue}
                    onChangeFn={this.props.changeEthValue}
                    placeholder={`${intl.formatIntlMessage(
                      "investment-flow.min-ticket-size",
                    )} ${formatNumber({
                      value: minTicketEth,
                      inputFormat: ENumberInputFormat.DECIMAL,
                      outputFormat: ENumberOutputFormat.FULL,
                      decimalPlaces: selectDecimalPlaces(ECurrency.ETH, ENumberOutputFormat.FULL),
                      roundingMode: ERoundingMode.UP,
                    })} ETH`}
                    data-test-id="invest-modal-eth-field"
                    showUnits={true}
                    errorMsg={error}
                    invalid={!!error}
                    setError={this.setError}
                  />
                  <div className={styles.helpText}>
                    {"≈ "}
                    <Eur
                      value={
                        isValidFormNumber(euroValue)
                          ? euroValue
                          : "0" /* Show 0 if form is invalid */
                      }
                    />
                  </div>
                </>
              )}
              {this.walletHasFunds() && (
                <small>
                  <ButtonInline
                    className={cn(styles.investAll, "text-right")}
                    data-test-id="invest-modal-full-balance-btn"
                    onClick={this.investEntireBalance}
                  >
                    <FormattedMessage id="investment-flow.invest-entire-balance" />
                  </ButtonInline>
                </small>
              )}
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
                    {(showTokens &&
                      !error &&
                      equityTokenCount &&
                      `${formatThousands(equityTokenCount.toString())} ${eto.equityTokenSymbol}`) ||
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
                    {(showTokens && !error && neuReward && <Neu value={neuReward} />) || "\xA0"}
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
              {gasCostEth && !error && gasCostEth !== "0" && (
                <div>
                  + <FormattedMessage id="investment-flow.estimated-gas-cost" />:{" "}
                  <span className="text-warning" data-test-id="invest-modal-gas-cost">
                    <Eth value={gasCostEth} />
                    <span className={styles.helpText}>
                      {" ≈ "}
                      <Eur value={gasCostEuro} />
                    </span>
                  </span>
                </div>
              )}
              <div>
                <FormattedMessage id="investment-flow.total" />:{" "}
                <span className="text-warning" data-test-id="invest-modal-total-cost">
                  {investmentCurrency === EInvestmentCurrency.EUR_TOKEN && (
                    <EurToken
                      value={this.calculateTotalCostIfValid(
                        convertToUlps(gasCostEuro),
                        euroValueUlps,
                      )}
                    />
                  )}
                  {investmentCurrency === EInvestmentCurrency.ETH && (
                    <>
                      <Eth value={this.calculateTotalCostIfValid(gasCostEth, ethValue)} />
                      <span className={styles.helpText}>
                        {" ≈ "}
                        <Eur value={this.calculateTotalCostIfValid(gasCostEuro, euroValue)} />
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
              layout={EButtonLayout.SECONDARY}
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
  }
}

export const InvestmentSelection = compose<IProps, {}>(
  injectIntlHelpers,
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectInvestmentEtoId(state);
      const eto = nonNullable(
        etoModuleApi.selectors.selectEtoWithCompanyAndContractById(state, etoId),
      );

      if (!etoModuleApi.utils.isOnChain(eto)) {
        throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
      }

      const eur = selectInvestmentEurValue(state);

      return {
        eto,
        etherPriceEur: selectEtherPriceEur(state),
        eurPriceEther: selectEurPriceEther(state),
        euroValue: eur,
        ethValue: selectInvestmentEthValueUlps(state),
        errorState: selectInvestmentErrorState(state),
        txValidationState: selectTxValidationState(state),
        gasCostEth: selectTxGasCostEthUlps(state),
        investmentType: nonNullable(selectInvestmentType(state)),
        wallets: selectWallets(state),
        neuReward: investorPortfolioModuleApi.selectors.selectNeuRewardUlpsByEtoId(state, etoId),
        equityTokenCount: investorPortfolioModuleApi.selectors.selectEquityTokenCountByEtoId(
          state,
          etoId,
        ),
        showTokens: !!(eur && selectIsInvestmentInputValidated(state)),
        readyToInvest: selectIsReadyToInvest(state),
        etoTicketSizes: investorPortfolioModuleApi.selectors.selectCalculatedEtoTicketSizesUlpsById(
          state,
          etoId,
        ),
        hasPreviouslyInvested: investorPortfolioModuleApi.selectors.selectHasInvestorTicket(
          state,
          etoId,
        ),
        etoTokenGeneralDiscounts: nonNullable(
          etoModuleApi.selectors.selectEtoTokenGeneralDiscounts(state, etoId),
        ),
        etoTokenPersonalDiscount: nonNullable(
          investorPortfolioModuleApi.selectors.selectPersonalDiscount(state, etoId),
        ),
        etoTokenStandardPrice: nonNullable(
          etoModuleApi.selectors.selectEtoTokenStandardPrice(state, eto.previewCode),
        ),
      };
    },
    dispatchToProps: dispatch => ({
      sendTransaction: () => dispatch(actions.txSender.txSenderAcceptDraft()),
      changeEthValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, ECurrency.ETH)),
      changeEuroValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, ECurrency.EUR_TOKEN)),
      changeInvestmentType: (type: EInvestmentType) =>
        dispatch(actions.investmentFlow.selectInvestmentType(type)),
      investEntireBalance: () => dispatch(actions.investmentFlow.investEntireBalance()),
      startUpgradeFlow: (token: ETokenType) => dispatch(actions.txTransactions.startUpgrade(token)),
    }),
  }),
  withProps<IWithProps, IStateProps>(
    ({ ethValue, etoTicketSizes, gasCostEth, etherPriceEur, eurPriceEther, investmentType }) => {
      const gasCostEthWithFallback = !ethValue ? "0" : gasCostEth;
      const gasCostEuro = convertFromUlps(
        multiplyBigNumbers([gasCostEthWithFallback, etherPriceEur]),
      ).toString();
      // TODO: do not cast minTicketEur/maxTicketEur to FLOAT as then we loose precision
      const minTicketEur =
        (etoTicketSizes &&
          etoTicketSizes.minTicketEurUlps &&
          formatMinMaxTickets(etoTicketSizes.minTicketEurUlps, ERoundingMode.UP)) ||
        "0";
      const maxTicketEur =
        (etoTicketSizes &&
          etoTicketSizes.maxTicketEurUlps &&
          formatMinMaxTickets(etoTicketSizes.maxTicketEurUlps, ERoundingMode.DOWN)) ||
        "0";
      const investmentCurrency = getInvestmentCurrency(investmentType);

      return {
        minTicketEur,
        maxTicketEur,
        minTicketEth: multiplyBigNumbers([minTicketEur, eurPriceEther]),
        gasCostEuro,
        gasCostEth: gasCostEthWithFallback,
        investmentCurrency,
      };
    },
  ),
)(InvestmentSelectionComponent);
