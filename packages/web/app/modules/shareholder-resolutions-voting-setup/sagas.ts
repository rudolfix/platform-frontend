import { put, SagaGenerator, takeEvery } from "@neufund/sagas";
import { neuGetBindings } from "@neufund/shared-modules";
import { symbols } from "../../di/symbols";
import { TActionFromCreator } from "../actions";
import { actions } from "./actions";
import { shareholderResolutionsVotingSetupModuleApi } from "./module";

function* uploadResolutionDocument(
  action: TActionFromCreator<typeof actions.uploadResolutionDocument>,
): SagaGenerator<void> {
  try {
    const { apiImmutableStorage } = yield* neuGetBindings({
      apiImmutableStorage: symbols.apiImmutableStorage,
    });

    const { file } = action.payload;

    const response = yield apiImmutableStorage.uploadFile('pdf', file);
    console.log(response);
  } catch (e) {
    yield put(actions.uploadResolutionDocumentError());
  }
}

export function* shareholderResolutionsVotingSetupSagas(): SagaGenerator<void> {
  yield takeEvery(
    shareholderResolutionsVotingSetupModuleApi.actions.uploadResolutionDocument,
    uploadResolutionDocument,
  );
}
