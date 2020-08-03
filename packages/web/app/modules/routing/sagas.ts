import { all, Effect, fork, put, SagaGenerator, select } from "@neufund/sagas";
import { EUserType, routingModuleApi } from "@neufund/shared-modules";
import { LocationChangeAction, RouterState } from "connected-react-router";
import { match } from "react-router-dom";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TActionFromCreator } from "../actions";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { waitForAppInit } from "../init/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { routeEffects } from "./routeEffects";

type TRouteActions = {
  // "undefined" is for backwards compatibility,
  // see comments in the ./routeDefinitions.ts
  notAuth: undefined | Array<Effect> | Effect;
  investor: undefined | Array<Effect> | Effect;
  issuer: undefined | Array<Effect> | Effect;
  nominee: undefined | Array<Effect> | Effect;
};

export const GREYP_PREVIEW_CODE = "e2b6949e-951d-4e99-ac11-534fdad86a80";

function* openInNewWindowSaga(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.routing.openInNewWindow>,
): SagaGenerator<void> {
  const { path } = action.payload;

  //Open the popup and set the opener and referrer policy instruction
  const newWindow = window.open(path, "_blank", "noopener,noreferrer");

  //Reset the opener link
  if (newWindow) {
    newWindow.opener = null;
  }
}

export function* startRouteBasedSagas(
  { logger }: TGlobalDependencies,
  action: LocationChangeAction,
): Generator<any, any, any> {
  const appIsReady = yield waitForAppInit();
  const userIsAuthorized = yield* select(selectIsAuthorized);
  const userType = yield* select(selectUserType);

  logger.info(
    `userIsAuthorized: ${userIsAuthorized.toString()}, userType: ${userType}, route: ${
      action.payload.location.pathname
    }`,
  );

  if (appIsReady) {
    yield neuCall(router, action.payload);
  }
}

export function* router(
  { logger }: TGlobalDependencies,
  payload: RouterState,
): Generator<any, any, any> {
  try {
    for (const effect of routeEffects) {
      const routeMatch = yield effect(payload);
      if (routeMatch) {
        return;
      }
    }
    return;
  } catch (e) {
    logger.error(e, "error in routing saga");
    yield put(actions.routing.goHome());
  }
}

export function* routeInternal(routeActions: TRouteActions): Generator<any, any, any> {
  // if routeAction is defined, execute it and return true to stop iterating over routes.
  // If action is undefined, simply return true, this is for backwards
  // compatibility with our legacy routing
  const userIsAuthorized = yield select(selectIsAuthorized);
  const userType = yield select(selectUserType);

  if (!userIsAuthorized) {
    yield routeActions.notAuth;
    return true;
  }

  let userTypeActions;

  if (userType === EUserType.INVESTOR) {
    userTypeActions = routeActions.investor;
  } else if (userType === EUserType.ISSUER) {
    userTypeActions = routeActions.issuer;
  } else if (userType === EUserType.NOMINEE) {
    userTypeActions = routeActions.nominee;
  }

  if (actions) {
    if (Array.isArray(userTypeActions)) {
      yield all(userTypeActions);
    } else {
      yield userTypeActions;
    }
    return true;
  }
}

export function* routeAction<P>(
  routeMatch: match<P> | null,
  routeActions: TRouteActions,
): Generator<any, any, any> {
  if (routeMatch !== null) {
    return yield routeInternal(routeActions);
  }
}

/**
 * Forward routes from shared modules
 */
export function* sharedRoutes(): Generator<unknown, void> {
  // default routes
  yield fork(neuTakeEvery, routingModuleApi.actions.goToDashboard, function*(): SagaGenerator<
    void
  > {
    yield put(actions.routing.goToDashboard());
  });
  yield fork(neuTakeEvery, routingModuleApi.actions.goHome, function*(): SagaGenerator<void> {
    yield put(actions.routing.goHome());
  });
  yield fork(neuTakeEvery, routingModuleApi.actions.goBack, function*(): SagaGenerator<void> {
    yield put(actions.routing.goBack());
  });
  // kyc routes
  yield fork(
    neuTakeEvery,
    routingModuleApi.actions.goToKYCIndividualAddress,
    function*(): SagaGenerator<void> {
      yield put(actions.routing.goToKYCIndividualAddress());
    },
  );
  yield fork(
    neuTakeEvery,
    routingModuleApi.actions.goToKYCIndividualFinancialDisclosure,
    function*(): SagaGenerator<void> {
      yield put(actions.routing.goToKYCIndividualFinancialDisclosure());
    },
  );
  yield fork(neuTakeEvery, routingModuleApi.actions.goToKYCSuccess, function*(): SagaGenerator<
    void
  > {
    yield put(actions.routing.goToKYCSuccess());
  });
  yield fork(neuTakeEvery, routingModuleApi.actions.goToKYCBusinessData, function*(): SagaGenerator<
    void
  > {
    yield put(actions.routing.goToKYCBusinessData());
  });
  yield fork(
    neuTakeEvery,
    routingModuleApi.actions.goToKYCManagingDirectors,
    function*(): SagaGenerator<void> {
      yield put(actions.routing.goToKYCManagingDirectors());
    },
  );
  yield fork(
    neuTakeEvery,
    routingModuleApi.actions.goToKYCIndividualDocumentVerification,
    function*(): SagaGenerator<void> {
      yield put(actions.routing.goToKYCIndividualDocumentVerification());
    },
  );
}

export function* routingSagas(): SagaGenerator<void> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", startRouteBasedSagas);
  yield fork(sharedRoutes);
}
