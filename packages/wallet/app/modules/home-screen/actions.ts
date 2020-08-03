import { createActionFactory } from "@neufund/shared-utils";

import { EScreenState } from "modules/types";

export const actions = {
  loadHomeScreen: createActionFactory("HOME_SCREEN_LOAD"),
  refreshHomeScreen: createActionFactory("HOME_SCREEN_REFRESH"),
  setHomeScreenState: createActionFactory("HOME_SCREEN_SET_STATE", (screenState: EScreenState) => ({
    screenState,
  })),
};
