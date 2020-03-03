import { Schema } from "../../../lib/yup-ts.unsafe";
import { ETxSenderType } from "../types";
import { TUserClaimAdditionalData, UserClaimAdditionalDataSchema } from "./claim/types";
import { EtoSetDateAdditionalDataSchema, TEtoSetDateAdditionalDataSchema } from "./eto-flow/types";
import {
  InvestmentAdditionalDataSchema,
  InvestorSignAgreementSchema,
  TInvestmentAdditionalDataYTS,
} from "./investment/types";
import { TokenAgreementContractSchema } from "./nominee/sign-agreement/types";
import {
  InvestorAcceptPayoutAdditionalDataSchema,
  TInvestorAcceptPayoutAdditionalData,
} from "./payout/types";
import { NeurRedeemAdditionalDataSchema, TNeurRedeemAdditionalData } from "./redeem/types";
import { InvestorRefundAdditionalData, InvestorRefundAdditionalSchema } from "./refund/types";
import {
  TokenTransferAdditionalData,
  TokenTransferAdditionalDataSchema,
  TTokenTransferAdditionalData,
} from "./token-transfer/types";
import { TUnlockAdditionalDataYTS, UnlockAdditionalDataSchema } from "./unlock/types";
import { TUpgradeAdditionalDataYTS, UpgradeAdditionalDataSchema } from "./upgrade/types";
import { TWithdrawAdditionalData, WithdrawAdditionalDataSchema } from "./withdraw/types";

export const typeToSchema: Record<ETxSenderType, Schema<unknown>> = {
  [ETxSenderType.INVEST]: InvestmentAdditionalDataSchema,
  [ETxSenderType.USER_CLAIM]: UserClaimAdditionalDataSchema,
  [ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT]: InvestorAcceptPayoutAdditionalDataSchema,
  [ETxSenderType.INVESTOR_ACCEPT_PAYOUT]: InvestorAcceptPayoutAdditionalDataSchema,
  [ETxSenderType.NEUR_REDEEM]: NeurRedeemAdditionalDataSchema,
  [ETxSenderType.INVESTOR_REFUND]: InvestorRefundAdditionalSchema,
  [ETxSenderType.WITHDRAW]: WithdrawAdditionalDataSchema,
  [ETxSenderType.TRANSFER_TOKENS]: TokenTransferAdditionalDataSchema,
  [ETxSenderType.UNLOCK_FUNDS]: UnlockAdditionalDataSchema,
  [ETxSenderType.UPGRADE]: UpgradeAdditionalDataSchema,
  [ETxSenderType.ETO_SET_DATE]: EtoSetDateAdditionalDataSchema,
  [ETxSenderType.SIGN_INVESTMENT_AGREEMENT]: InvestorSignAgreementSchema,
  [ETxSenderType.NOMINEE_ISHA_SIGN]: TokenAgreementContractSchema,
  [ETxSenderType.NOMINEE_RAAA_SIGN]: TokenAgreementContractSchema,
  [ETxSenderType.NOMINEE_THA_SIGN]: TokenAgreementContractSchema,
};
export type TTransactionAdditionalData =
  | TInvestmentAdditionalDataYTS
  | TTokenTransferAdditionalData
  | TWithdrawAdditionalData
  | TUserClaimAdditionalData
  | TUpgradeAdditionalDataYTS
  | TInvestorAcceptPayoutAdditionalData
  | TokenAgreementContractSchema
  | TNeurRedeemAdditionalData
  | TokenTransferAdditionalData
  | TUnlockAdditionalDataYTS
  | TEtoSetDateAdditionalDataSchema
  | InvestorRefundAdditionalData;
