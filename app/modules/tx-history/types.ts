import {
  ECurrency,
  ENumberInputFormat,
  EquityToken,
} from "../../components/shared/formatters/utils";
import { ETransactionDirection, ETransactionType } from "../../lib/api/analytics-api/interfaces";

export type TTxHistoryCommon = {
  type: ETransactionType;
  date: string;
  transactionDirection: ETransactionDirection;
  id: string;
  currency: ECurrency | EquityToken;
  amount: number;
  amountFormat: ENumberInputFormat;
};

export type TEtoTx = {
  type: ETransactionType.ETO_INVESTMENT | ETransactionType.ETO_REFUND;
  companyName: string;
};

export type TTx = {
  type:
    | ETransactionType.TRANSFER
    | ETransactionType.NEUR_PURCHASE
    | ETransactionType.NEUR_REDEEM
    | ETransactionType.ETO_TOKENS_CLAIM
    | ETransactionType.REDISTRIBUTE_PAYOUT
    | ETransactionType.PAYOUT
    | ETransactionType.NEUR_DESTROY;
};

export type TTxHistory = (TEtoTx | TTx) & TTxHistoryCommon;
