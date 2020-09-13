import { call, put, SagaGenerator, select, takeEvery } from "@neufund/sagas";
import { convertFromUlps } from "@neufund/shared-utils";
import { IControllerGovernance } from "../../lib/contracts/IControllerGovernance";
import { selectIssuerEto } from "../eto-flow/selectors";
import { selectGovernanceController } from "../governance/sagas";
import { uploadResolutionDocument } from "./document-upload/sagas";
import { shareholderResolutionsVotingSetupModuleApi } from "./module";

export function* getShareCapital() {
  const eto = yield select(selectIssuerEto);
  console.log({ eto });
  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );
  console.log({ governanceController });
  const [shareCapital] = yield governanceController.shareholderInformation();
  yield put(
    shareholderResolutionsVotingSetupModuleApi.actions.setShareCapital(
      convertFromUlps(shareCapital.toString()).toString(),
    ),
  );
}

export function* shareholderResolutionsVotingSetupSagas(): SagaGenerator<void> {
  yield takeEvery(
    shareholderResolutionsVotingSetupModuleApi.actions.getShareCapital,
    getShareCapital,
  );
  yield takeEvery(
    shareholderResolutionsVotingSetupModuleApi.actions.uploadResolutionDocument,
    uploadResolutionDocument,
  );
}
