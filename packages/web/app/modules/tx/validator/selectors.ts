import { DeepReadonlyObject } from "@neufund/shared";

import { IAppState } from "../../../store";
import { IInvestmentFlowState } from "../../investment-flow/reducer";
import { EAdditionalValidationDataNotifications, EValidationState } from "./reducer";

export const selectTxValidationState = (state: IAppState): EValidationState | undefined =>
  state.txValidator.validationState;

export const selectTxValidationNotifications = (
  state: IAppState,
): ReadonlyArray<EAdditionalValidationDataNotifications> => state.txValidator.notifications;

export const selectInvestmentFLow = (state: IAppState): DeepReadonlyObject<IInvestmentFlowState> =>
  state.investmentFlow;
