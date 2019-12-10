import { IAppState } from "../../../store";
import { EAdditionalValidationDataNotifications, EValidationState } from "./reducer";

export const selectTxValidationState = (state: IAppState): EValidationState | undefined =>
  state.txValidator.validationState;

export const selectTxValidationNotifications = (
  state: IAppState,
): ReadonlyArray<EAdditionalValidationDataNotifications> => state.txValidator.notifications;
