import { DeepReadonlyObject } from "@neufund/shared";

import { TAppGlobalState } from "../../../store";
import { IInvestmentFlowState } from "../../investment-flow/reducer";
import { EAdditionalValidationDataNotifications, EValidationState } from "./reducer";

export const selectTxValidationState = (state: TAppGlobalState): EValidationState | undefined =>
  state.txValidator.validationState;

export const selectTxValidationNotifications = (
  state: TAppGlobalState,
): ReadonlyArray<EAdditionalValidationDataNotifications> => state.txValidator.notifications;

export const selectInvestmentFLow = (
  state: TAppGlobalState,
): DeepReadonlyObject<IInvestmentFlowState> => state.investmentFlow;
