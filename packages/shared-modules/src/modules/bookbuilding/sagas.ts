import {
  call,
  delay,
  fork,
  neuCall,
  neuTakeEvery,
  neuTakeLatestUntil,
  put,
  SagaGenerator,
  select,
  StringableActionCreator,
  TActionFromCreator,
  take,
} from "@neufund/sagas";

import { createMessage, TMessage } from "../../messages";
import { neuGetBindings } from "../../utils";
import { EJwtPermissions } from "../auth/module";
import { coreModuleApi, IHttpResponse } from "../core/module";
import { etoNormalPollingDelay } from "../eto/constants";
import { etoModuleApi } from "../eto/module";
import { selectEtoById, selectEtoOnChainStateById } from "../eto/selectors";
import { EETOStateOnChain } from "../eto/types";
import { notificationUIModuleApi } from "../notification-ui/module";
import { bookbuildingActions } from "./actions";
import { PLEDGE_REFRESH_DELAY } from "./constants";
import { EtoPledgeNotFound, EtoPledgesNotFound } from "./lib/http/eto-pledge-api/EtoPledgeApi";
import {
  IBookBuildingStats,
  IPledge,
} from "./lib/http/eto-pledge-api/EtoPledgeApi.interfaces.unsafe";
import { BookbuildingMessage } from "./messages";
import { TBookbuildingModuleState } from "./module";
import { symbols } from "./symbols";
import { canLoadPledges, shouldLoadBookbuildingStats } from "./utils";

type TGlobalDependencies = unknown;

export function* saveMyPledgeEffect(
  _: TGlobalDependencies,
  etoId: string,
  pledge: IPledge,
): Generator<any, any, any> {
  const { apiEtoPledgeService } = yield* neuGetBindings({
    apiEtoPledgeService: symbols.etoPledgeApi,
  });
  const pledgeResult: IHttpResponse<IPledge> = yield apiEtoPledgeService.saveMyPledge(
    etoId,
    pledge,
  );

  yield put(bookbuildingActions.setPledge(etoId, pledgeResult.body));
  yield put(bookbuildingActions.loadBookBuildingStats(etoId));
}

export function* saveMyPledge(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof bookbuildingActions, typeof bookbuildingActions.savePledge>,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  const { etoId, pledge } = action.payload;

  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(saveMyPledgeEffect, etoId, pledge),
      [EJwtPermissions.DO_BOOK_BUILDING],
      createMessage(BookbuildingMessage.PLEDGE_FLOW_CONFIRM_PLEDGE),
      createMessage(BookbuildingMessage.PLEDGE_FLOW_PLEDGE_DESCRIPTION),
    );
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(BookbuildingMessage.PLEDGE_FLOW_FAILED_TO_SAVE_PLEDGE),
      ),
    );
    logger.error(e, `Failed to save pledge`);
  }
}

export function* deleteMyPledgeEffect(_: TGlobalDependencies, etoId: string): any {
  const { apiEtoPledgeService } = yield* neuGetBindings({
    apiEtoPledgeService: symbols.etoPledgeApi,
  });
  yield apiEtoPledgeService.deleteMyPledge(etoId);

  yield put(bookbuildingActions.setPledge(etoId));
  yield put(bookbuildingActions.loadBookBuildingStats(etoId));
}

export function* deleteMyPledge(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof bookbuildingActions, typeof bookbuildingActions.deletePledge>,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  const { etoId } = action.payload;
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(deleteMyPledgeEffect, etoId),
      [EJwtPermissions.DO_BOOK_BUILDING],
      createMessage(BookbuildingMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL),
      createMessage(BookbuildingMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL_DESCRIPTION),
    );
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(BookbuildingMessage.PLEDGE_FLOW_PLEDGE_REMOVAL_FAILED),
      ),
    );
    logger.error(e, `Failed to delete pledge`);
  }
}

export function* watchBookBuildingStats(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof bookbuildingActions,
    typeof bookbuildingActions.bookBuildingStartWatch
  >,
  refreshOnAction: StringableActionCreator<any> | undefined,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  while (true) {
    logger.info("Querying for bookbuilding stats...");
    try {
      yield neuCall(
        loadBookBuildingStats,
        bookbuildingActions.loadBookBuildingStats(action.payload.etoId),
      );
    } catch (e) {
      logger.error(e, "Error getting bookbuilding stats");
    }
    if (refreshOnAction) {
      yield take(refreshOnAction);
    } else {
      yield delay(PLEDGE_REFRESH_DELAY);
    }
  }
}

export function* loadBookBuildingStats(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof bookbuildingActions,
    typeof bookbuildingActions.loadBookBuildingStats
  >,
): Generator<any, any, any> {
  const { logger, apiEtoService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoService: etoModuleApi.symbols.etoApi,
  });
  try {
    const etoId = action.payload.etoId;
    const statsResponse: IHttpResponse<any> = yield apiEtoService.getBookBuildingStats(etoId);

    yield put(bookbuildingActions.setBookBuildingStats(etoId, statsResponse.body));
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(BookbuildingMessage.PLEDGE_FLOW_FAILED_TO_GET_BOOKBUILDING_STATS),
      ),
    );

    logger.error(e, `Failed to load bookbuilding stats pledge`);
  }
}

export function* loadBookBuildingListStats(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof bookbuildingActions,
    typeof bookbuildingActions.loadBookBuildingListStats
  >,
): Generator<any, any, any> {
  const { logger, apiEtoService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoService: etoModuleApi.symbols.etoApi,
  });
  try {
    const etosIds = action.payload.etosIds;

    // there are some edge cases where eto list is empty
    // therefore there is no need to fetch in batch bookbuilding stats
    if (etosIds.length === 0) {
      logger.info("No ETO's to load bookbuilding stats for");

      return;
    }

    const statsListResponse: Record<
      string,
      IBookBuildingStats
    > = yield apiEtoService.getBookBuildingStatsList(etosIds);

    yield put(bookbuildingActions.setBookBuildingListStats(statsListResponse));
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(BookbuildingMessage.PLEDGE_FLOW_FAILED_TO_GET_BOOKBUILDING_STATS),
      ),
    );

    logger.error(e, `Failed to load bookbuilding stats pledge`);
  }
}

export function* loadPledgeForEto(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof bookbuildingActions,
    typeof bookbuildingActions.loadPledgeForEto
  >,
): Generator<any, any, any> {
  const { logger, apiEtoPledgeService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoPledgeService: symbols.etoPledgeApi,
  });
  try {
    const { etoId } = action.payload;
    const canLoadPledgesResult = yield* call(canLoadPledges);

    if (canLoadPledgesResult) {
      const eto = yield* select((state: TBookbuildingModuleState) => selectEtoById(state, etoId));
      const onChainState:
        | EETOStateOnChain
        | undefined = yield* select((state: TBookbuildingModuleState) =>
        selectEtoOnChainStateById(state, etoId),
      );

      if (eto && shouldLoadBookbuildingStats(eto.state, onChainState)) {
        const pledgeResponse: IHttpResponse<IPledge> = yield apiEtoPledgeService.getPledgeForEto(
          etoId,
        );
        yield put(bookbuildingActions.setPledge(etoId, pledgeResponse.body));
      }
    }
  } catch (e) {
    if (!(e instanceof EtoPledgeNotFound)) {
      yield put(
        notificationUIModuleApi.actions.showError(
          createMessage(BookbuildingMessage.PLEDGE_FLOW_FAILED_TO_LOAD_PLEDGE),
        ),
      );
      logger.error(e, "Failed to load pledge");
    }
  }
}

export function* loadAllMyPledges(_: TGlobalDependencies): Generator<any, void, any> {
  const { logger, apiEtoPledgeService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoPledgeService: symbols.etoPledgeApi,
  });
  try {
    const canLoadPledgesResult = yield* call(canLoadPledges);

    if (canLoadPledgesResult) {
      const pledges = yield* call(() => apiEtoPledgeService.getAllMyPledges());
      yield put(bookbuildingActions.setPledges(pledges));
    }
  } catch (e) {
    if (!(e instanceof EtoPledgesNotFound)) {
      yield put(
        notificationUIModuleApi.actions.showError(
          createMessage(BookbuildingMessage.PLEDGE_FLOW_FAILED_TO_LOAD_PLEDGE),
        ),
      );

      logger.error(e, "Failed to load pledges");
    }
  }
}

export function* watchPledges(): Generator<any, void, void> {
  while (true) {
    yield delay(etoNormalPollingDelay);
    yield put(bookbuildingActions.loadAllPledges());
  }
}

type TEnsurePermissionsArePresentAndRunEffect = (
  _: any,
  effect: Generator<any, any, any>,
  permissions: Array<EJwtPermissions>,
  title: TMessage,
  message?: TMessage,
  inputLabel?: TMessage,
) => Generator<any, any, any>;

type TSetupSagasConfig = {
  ensurePermissionsArePresentAndRunEffect: TEnsurePermissionsArePresentAndRunEffect;
  refreshOnAction: StringableActionCreator<any> | undefined;
};
let ensurePermissionsArePresentAndRunEffect: TEnsurePermissionsArePresentAndRunEffect;

export function setupBookbuildingSagas(config: TSetupSagasConfig): () => SagaGenerator<void> {
  ensurePermissionsArePresentAndRunEffect = config.ensurePermissionsArePresentAndRunEffect;

  return function* bookBuildingSagas(): Generator<any, any, any> {
    yield fork(neuTakeEvery, bookbuildingActions.loadBookBuildingStats, loadBookBuildingStats);
    yield fork(
      neuTakeLatestUntil,
      bookbuildingActions.bookBuildingStartWatch,
      bookbuildingActions.bookBuildingStopWatch,
      watchBookBuildingStats,
      config.refreshOnAction,
    );
    yield fork(
      neuTakeEvery,
      bookbuildingActions.loadBookBuildingListStats,
      loadBookBuildingListStats,
    );
    yield fork(neuTakeEvery, bookbuildingActions.loadPledgeForEto, loadPledgeForEto);
    yield fork(neuTakeEvery, bookbuildingActions.loadAllPledges, loadAllMyPledges);
    yield fork(neuTakeEvery, bookbuildingActions.savePledge, saveMyPledge);
    yield fork(neuTakeEvery, bookbuildingActions.deletePledge, deleteMyPledge);
    yield fork(watchPledges);
  };
}
