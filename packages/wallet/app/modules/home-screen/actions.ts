import { createActionFactory } from "@neufund/shared-utils";

import { EViewState } from "./types";

export const actions = {
  loadHomeView: createActionFactory("HOME_VIEW_LOAD"),
  refreshHomeView: createActionFactory("HOME_VIEW_REFRESH"),
  setHomeViewState: createActionFactory("HOME_VIEW_SET_STATE", (viewState: EViewState) => ({
    viewState,
  })),
};
