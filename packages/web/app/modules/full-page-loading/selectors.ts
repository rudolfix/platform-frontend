import { createSelector } from "reselect";

import { TAppGlobalState } from "../../store";

const selectFullPageLoading = (state: TAppGlobalState) => state.fullPageLoading;

export const selectFullPageLoadingIsOpen = createSelector(
  selectFullPageLoading,
  state => state.isOpen,
);
