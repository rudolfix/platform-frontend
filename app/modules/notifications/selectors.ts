import { some } from "lodash";

import { IAppState } from "../../store";
import { selectBackupCodesVerified, selectIsUserEmailVerified } from "../auth/selectors";
import { selectKycRequestStatus, selectWidgetLoading } from "./../kyc/selectors";
import { settingsNotification } from "./reducer";
import { appRoutes } from "../../components/appRoutes";

export const selectIsActionRequiredSettings = (state: IAppState): boolean => {
  if (selectWidgetLoading(state.kyc)) {
    return false;
  }

  const disallowedViewsPaths = [appRoutes.settings, appRoutes.kyc];

  if (
    state.router.location &&
    some(disallowedViewsPaths, p => state.router.location!.pathname.startsWith(p))
  ) {
    return false;
  }

  return (
    !selectIsUserEmailVerified(state.auth) ||
    !selectBackupCodesVerified(state.auth) ||
    selectKycRequestStatus(state.kyc) !== "Accepted"
  );
};

export const selectSettingsNotification = (state: IAppState) =>
  selectIsActionRequiredSettings(state) ? settingsNotification() : undefined;
