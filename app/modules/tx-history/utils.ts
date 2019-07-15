import {
  ECurrency,
  ENumberInputFormat,
  EquityToken,
} from "../../components/shared/formatters/utils";
import {
  ETransactionType,
  TAnalyticsTransaction,
  TAnalyticsTransactionTokenMetadata,
} from "../../lib/api/analytics-api/interfaces";
import { TTxHistory } from "./types";

// TODO: Try to sync backend currency format with frontend, as currently we use `eur_t` for nEur
const getCurrencyForTokenSymbol = (
  metadata: TAnalyticsTransactionTokenMetadata,
): ECurrency | EquityToken => {
  switch (metadata.tokenSymbol) {
    case "nEur":
      return ECurrency.EUR_TOKEN;
    case "neu":
      return ECurrency.NEU;
    case "eth":
      return ECurrency.ETH;
    default:
      return metadata.tokenSymbol as EquityToken;
  }
};

const getDecimalsFormat = (
  metadata: TAnalyticsTransactionTokenMetadata | undefined,
): ENumberInputFormat => {
  switch (metadata && metadata.tokenDecimals) {
    case 0:
      return ENumberInputFormat.FLOAT;
    case 18:
    default:
      return ENumberInputFormat.ULPS;
  }
};

const getTxUniqueId = (transaction: TAnalyticsTransaction) =>
  `${transaction.blockNumber}_${transaction.transactionIndex}_${transaction.logIndex}`;

export function mapAnalyticsTransaction(
  transaction: TAnalyticsTransaction,
): TTxHistory | undefined {
  const common = {
    date: transaction.blockTime,
    transactionDirection: transaction.transactionDirection,
    id: getTxUniqueId(transaction),
    amount: transaction.extraData.amount,
    amountFormat: getDecimalsFormat(transaction.extraData.tokenMetadata),
  };

  switch (transaction.type) {
    case ETransactionType.ETO_INVESTMENT:
    case ETransactionType.ETO_REFUND: {
      if (!transaction.extraData.assetTokenMetadata || !transaction.extraData.tokenMetadata) {
        throw new Error("Invalid asset token metadata");
      }

      return {
        ...common,
        type: transaction.type,
        // TODO: Remove non-null assertion operator after `ETO_REFUND` is fixed on a backend
        // see https://github.com/Neufund/platform-backend/pull/1874
        companyName: transaction.extraData.assetTokenMetadata.companyName!,
        currency: getCurrencyForTokenSymbol(transaction.extraData.tokenMetadata),
      };
    }
    case ETransactionType.TRANSFER: {
      // In case it's an token transaction
      if (transaction.extraData.tokenMetadata) {
        return {
          ...common,
          type: transaction.type,
          currency: getCurrencyForTokenSymbol(transaction.extraData.tokenMetadata),
        };
      }

      return {
        ...common,
        type: transaction.type,
        currency: ECurrency.ETH,
      };
    }
    case ETransactionType.NEUR_REDEEM:
    case ETransactionType.NEUR_DESTROY:
    case ETransactionType.NEUR_PURCHASE: {
      return {
        ...common,
        type: transaction.type,
        currency: ECurrency.EUR_TOKEN,
      };
    }
    case ETransactionType.ETO_TOKENS_CLAIM: {
      if (!transaction.extraData.assetTokenMetadata) {
        throw new Error("Asset token metadata should be provided");
      }

      return {
        ...common,
        type: transaction.type,
        amountFormat: getDecimalsFormat(transaction.extraData.assetTokenMetadata),
        currency: getCurrencyForTokenSymbol(transaction.extraData.assetTokenMetadata),
      };
    }
    case ETransactionType.PAYOUT:
    case ETransactionType.REDISTRIBUTE_PAYOUT: {
      if (!transaction.extraData.tokenMetadata) {
        throw new Error("Invalid token metadata");
      }

      return {
        ...common,
        type: transaction.type,
        currency: getCurrencyForTokenSymbol(transaction.extraData.tokenMetadata),
      };
    }
    default:
      return undefined;
  }
}

export { getCurrencyForTokenSymbol, getDecimalsFormat, getTxUniqueId };
