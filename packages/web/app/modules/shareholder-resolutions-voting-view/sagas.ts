import { call, put, SagaGenerator, TActionFromCreator, takeLatest } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";

import { EVotingErrorMessage } from "../../components/translatedMessages/messages";
import { createNotificationMessage } from "../../components/translatedMessages/utils";
import { EProcessState } from "../../utils/enums/processStates";
import { actions as globalActions } from "../actions";
import { webNotificationUIModuleApi } from "../notification-ui/module";
import { shareholderResolutionsVotingModuleApi } from "../shareholder-resolutions-voting/module";
import { actions } from "./actions";

export function* loadInvestorShareholderResolution(
  action: TActionFromCreator<
    typeof actions,
    | typeof actions.loadInvestorShareholderResolutionVotingView
    | typeof actions.refreshInvestorShareholderResolutionVotingView
  >,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  const proposalId = action.payload.proposalId;

  try {
    yield* call(
      shareholderResolutionsVotingModuleApi.sagas.loadInvestorShareholderResolution,
      proposalId,
    );

    yield put(actions.setShareholderResolutionVotingViewState(EProcessState.SUCCESS));
  } catch (e) {
    switch (e.constructor) {
      case shareholderResolutionsVotingModuleApi.errors.ProposalNotFoundError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.UNKNOWN_PROPOSAL),
            {
              ["data-test-id"]:
                "modules.shareholder-resolutions-voting-view.sagas.toast.unknown-proposal",
            },
          ),
        );
        return;
      case shareholderResolutionsVotingModuleApi.errors.ShareholderHasNoAccessToProposalError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.CANNOT_VOTE),
            {
              ["data-test-id"]:
                "modules.shareholder-resolutions-voting-view.sagas.toast.no-access-to-proposal",
            },
          ),
        );
        return;
      case shareholderResolutionsVotingModuleApi.errors.ProposalStateNotSupportedError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.UNSUPPORTED_PROPOSAL_STATE),
          ),
        );
        return;

      default:
        logger.error(e, `Failed generate shareholder resolutions voting for ${proposalId}`);

        yield put(actions.setShareholderResolutionVotingViewState(EProcessState.ERROR));

        return;
    }
  }
}
export function* loadIssuerShareholderResolution(
  action: TActionFromCreator<
    typeof actions,
    typeof actions.loadIssuerShareholderResolutionVotingView
  >,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  const proposalId = action.payload.proposalId;

  try {
    yield* call(
      shareholderResolutionsVotingModuleApi.sagas.loadIssuerShareholderResolution,
      proposalId,
    );

    yield put(actions.setShareholderResolutionVotingViewState(EProcessState.SUCCESS));
  } catch (e) {
    switch (e.constructor) {
      case shareholderResolutionsVotingModuleApi.errors.ProposalNotFoundError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.UNKNOWN_PROPOSAL),
            {
              ["data-test-id"]:
                "modules.shareholder-resolutions-voting-view.sagas.toast.unknown-proposal",
            },
          ),
        );
        return;
      case shareholderResolutionsVotingModuleApi.errors.ProposalStateNotSupportedError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.UNSUPPORTED_PROPOSAL_STATE),
          ),
        );
        return;

      default:
        logger.error(e, `Failed generate shareholder resolutions voting for ${proposalId}`);

        yield put(actions.setShareholderResolutionVotingViewState(EProcessState.ERROR));

        return;
    }
  }
}

export function* shareholderResolutionsVotingSagas(): SagaGenerator<void> {
  yield takeLatest(
    actions.refreshInvestorShareholderResolutionVotingView,
    loadInvestorShareholderResolution,
  );
  yield takeLatest(
    actions.loadInvestorShareholderResolutionVotingView,
    loadInvestorShareholderResolution,
  );
  yield takeLatest(
    actions.loadIssuerShareholderResolutionVotingView,
    loadIssuerShareholderResolution,
  );
}
