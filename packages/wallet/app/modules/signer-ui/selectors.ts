import { StateFromReducersMapObject } from "redux";
import { createSelector } from "reselect";

import { signerUIReducerMap } from "./reducer";

const selectSignerUI = (state: StateFromReducersMapObject<typeof signerUIReducerMap>) =>
  state.signerUI;

const selectSignerUIState = createSelector(selectSignerUI, signerUi => signerUi.state);
const selectSignerUIRequest = createSelector(selectSignerUI, signerUi => signerUi.request);

export { selectSignerUIState, selectSignerUIRequest };
