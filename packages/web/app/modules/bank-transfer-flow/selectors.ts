import { kycApi, TBankAccount, TClaims } from "@neufund/shared-modules";
import { DeepReadonly } from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { TAppGlobalState } from "../../store";
import { EBankTransferFlowState } from "./reducer";

export const selectBankTransferFlow = (state: TAppGlobalState) => state.bankTransferFLow;

export const selectBankTransferFlowState = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.state,
);

export const selectIsBankTransferModalOpened = createSelector(
  selectBankTransferFlowState,
  state => state !== EBankTransferFlowState.UNINITIALIZED,
);

export const selectBankTransferFlowReference = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.reference,
);

export const selectBankTransferType = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.type,
);

export const selectBankTransferMinAmount = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.minEuro,
);

export const selectBankRedeemMinAmount = createSelector(selectBankTransferFlow, bankTransferFlow =>
  bankTransferFlow.redeem ? bankTransferFlow.redeem.minEuro : "0",
);

export const selectInitialAmount = (state: TAppGlobalState) => state.txUserFlowRedeem.initialValue;

export const selectBankFee = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.bankFee || "0",
);

export const selectRedeemFee = createSelector(selectBankTransferFlow, bankTransferFlow =>
  bankTransferFlow.redeem ? bankTransferFlow.redeem.bankFee : "0",
);

/**
 * Check whether bank account is verified.
 * Tree conditions must be met:
 * 1. User is verified (by API and Contract)
 * 2. User has bank account in API
 * 3. User has bank account in contract (IdentityRegistry)
 */
export const selectIsBankAccountVerified = createSelector<
  TAppGlobalState,
  DeepReadonly<TBankAccount> | undefined,
  TClaims | undefined,
  boolean
>(kycApi.selectors.selectBankAccount, kycApi.selectors.selectClaims, (bankAccount, claims) => {
  // claims and bankAccount can be undefined while loading
  if (claims && bankAccount) {
    return bankAccount.hasBankAccount && claims.hasBankAccount;
  }

  return false;
});
