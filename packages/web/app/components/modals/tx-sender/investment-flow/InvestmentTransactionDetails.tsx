import { EquityTokenPriceEuro, Eth, Eur, Neu, TokenIcon } from "@neufund/design-system";
import { ETxType, TEtoEquityTokenInfoType } from "@neufund/shared-modules";
import {
  addBigNumbers,
  convertFromUlps,
  divideBigNumbers,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  multiplyBigNumbers,
} from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { FormatNumber } from "../../../shared/formatters/FormatNumber";
import { Money } from "../../../shared/formatters/Money";
import { CurrencyIcon } from "../../../shared/icons";
import { TooltipBase } from "../../../shared/tooltips";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";
import { getActualTokenPriceEur, getTokenPriceDiscount } from "./utils";

import info from "../../../../assets/img/notifications/info.svg";
import * as styles from "./Summary.module.scss";

const NeuRewardCaption: React.FunctionComponent<{ isIcbm?: boolean }> = ({ isIcbm }) => {
  const neuMsg = <FormattedMessage id="investment-flow.summary.estimated-reward" />;
  const icbmMsg = (
    <>
      {neuMsg}
      <img className={styles.infoIcon} id="tooltip-target-neu" src={info} alt="" />
      <TooltipBase target="tooltip-target-neu">
        <FormattedMessage id="investment-flow.message.no-icbm-neu-reward" />
      </TooltipBase>
    </>
  );
  return isIcbm ? icbmMsg : neuMsg;
};

interface IEquityTockenValue {
  equityTokens: string;
  equityTokenInfo: TEtoEquityTokenInfoType;
}

interface IEstimatedReward {
  estimatedReward: string;
}

interface IInvestment {
  investmentEur: string;
  investmentEth: string;
}

interface ITokenPriceAndDiscount {
  actualTokenPrice: string;
  discount: string | null;
}

interface ITotal {
  totalCostEur: string;
  totalCostEth: string;
}

const EquityTokensValue: React.FunctionComponent<IEquityTockenValue> = ({
  equityTokens,
  equityTokenInfo,
}) => (
  <span>
    <TokenIcon srcSet={{ "1x": equityTokenInfo.equityTokenImage }} alt="" />{" "}
    <Money
      value={equityTokens}
      inputFormat={ENumberInputFormat.DECIMAL}
      valueType={equityTokenInfo.equityTokenSymbol}
      outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
    />
  </span>
);

const EstimatedRewardValue: React.FunctionComponent<IEstimatedReward> = ({ estimatedReward }) => (
  <span>
    <CurrencyIcon currency={ECurrency.NEU} /> <Neu value={estimatedReward} />
  </span>
);

const Investment: React.FunctionComponent<IInvestment> = ({ investmentEur, investmentEth }) => (
  <>
    <Eur data-test-id="euro" value={investmentEur} />
    {" ≈ "}
    <Eth data-test-id="eth" value={investmentEth} />
  </>
);

const TokenPriceAndDiscount: React.FunctionComponent<ITokenPriceAndDiscount> = ({
  actualTokenPrice,
  discount,
}) => (
  <>
    <EquityTokenPriceEuro data-test-id="token-price" value={actualTokenPrice} />
    {discount !== null && (
      <>
        {" (-"}
        <FormatNumber
          data-test-id="discount"
          value={discount}
          inputFormat={ENumberInputFormat.DECIMAL}
          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
        />
        {"%)"}
      </>
    )}
  </>
);

const Total: React.FunctionComponent<ITotal> = ({ totalCostEur, totalCostEth }) => (
  <>
    <Eur
      data-test-id="total-cost-euro"
      value={totalCostEur}
      outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
    />
    {" ≈ "}
    <Eth data-test-id="total-cost-eth" value={totalCostEth} />
  </>
);

const InvestmentTransactionDetails: TransactionDetailsComponent<ETxType.INVEST> = ({
  additionalData,
  className,
  txTimestamp,
}) => {
  const gasCostEuro = convertFromUlps(
    multiplyBigNumbers([additionalData.gasCostEth, additionalData.etherPriceEur]),
  ).toString();
  const totalCostEth = addBigNumbers([additionalData.gasCostEth, additionalData.investmentEth]);
  const totalCostEur = addBigNumbers([gasCostEuro, additionalData.investmentEur]);

  const actualTokenPrice = getActualTokenPriceEur(
    additionalData.investmentEur,
    additionalData.equityTokens,
  );
  const fullTokenPrice = divideBigNumbers(
    additionalData.eto.sharePrice.toString(),
    additionalData.eto.equityTokensPerShare.toString(),
  );

  const discount = getTokenPriceDiscount(fullTokenPrice, actualTokenPrice);
  return (
    <InfoList className={className}>
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.company" />}
        value={additionalData.eto.companyName}
      />
      <InfoRow
        data-test-id="investment-summary-token-price"
        caption={<FormattedMessage id="investment-flow.summary.token-price" />}
        value={<TokenPriceAndDiscount actualTokenPrice={actualTokenPrice} discount={discount} />}
      />
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.eto-address" />}
        value={additionalData.eto.etoId}
        data-test-id="investment-flow.summary.eto-address"
      />
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.your-investment" />}
        value={
          <Investment
            investmentEth={additionalData.investmentEth}
            investmentEur={additionalData.investmentEur}
          />
        }
        data-test-id="invest-modal-summary-your-investment"
      />
      <InfoRow
        data-test-id="investment-flow.summary.transaction-cost"
        caption={<FormattedMessage id="investment-flow.summary.transaction-cost" />}
        value={<Eth value={additionalData.gasCostEth} />}
      />
      <InfoRow
        data-test-id="investment-flow.summary.equity-tokens"
        caption={<FormattedMessage id="investment-flow.summary.equity-tokens" />}
        value={
          <EquityTokensValue
            equityTokens={additionalData.equityTokens}
            equityTokenInfo={additionalData.eto.equityTokenInfo}
          />
        }
      />
      <InfoRow
        data-test-id="investment-flow.summary.neu-reward"
        caption={<NeuRewardCaption isIcbm={additionalData.isIcbm} />}
        value={<EstimatedRewardValue estimatedReward={additionalData.estimatedReward} />}
      />
      <InfoRow
        data-test-id="investment-flow.summary.transaction-value"
        caption={<FormattedMessage id="investment-flow.summary.transaction-value" />}
        value={<Total totalCostEth={totalCostEth} totalCostEur={totalCostEur} />}
      />

      {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
    </InfoList>
  );
};

export { InvestmentTransactionDetails };
