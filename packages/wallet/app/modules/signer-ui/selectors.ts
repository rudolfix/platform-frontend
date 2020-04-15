import { createSelector } from "reselect";

const selectSignerUI = (state: any) => state.signerUI;

const selectSignerUIState = createSelector(selectSignerUI, signerUi => signerUi.state);
const selectSignerUIData = createSelector(selectSignerUI, signerUi => signerUi.data);

export { selectSignerUIState, selectSignerUIData };
