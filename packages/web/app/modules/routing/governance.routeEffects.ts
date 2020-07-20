import { call, put } from "@neufund/sagas";
import { RouterState } from "connected-react-router";
import { matchPath } from "react-router-dom";

import { appRoutes } from "../../components/appRoutes";
import { actions } from "../actions";
import { governanceModuleApi } from "../governance/module";
import { routeInternal } from "./sagas";

export function* governanceRoute(payload: RouterState): Generator<any, any, any> {
  const match = yield* call(() =>
    matchPath(payload.location.pathname, {
      path: appRoutes.governance,
      exact: true,
    }),
  );

  if (match !== null) {
    return yield routeInternal({
      notAuth: undefined,
      investor: undefined,
      issuer: put(actions.etoFlow.loadIssuerView()),
      nominee: undefined,
    });
  }
}

export function* governanceOverviewRoute(payload: RouterState): Generator<any, any, any> {
  const match = yield* call(() =>
    matchPath(payload.location.pathname, {
      path: appRoutes.governanceOverview,
      exact: true,
    }),
  );

  if (match !== null) {
    return yield routeInternal({
      notAuth: undefined,
      investor: undefined,
      issuer: put(actions.etoFlow.loadIssuerView()),
      nominee: undefined,
    });
  }
}

export function* governanceGeneralInformationRoute(payload: RouterState): Generator<any, any, any> {
  const match = yield* call(() =>
    matchPath(payload.location.pathname, {
      path: appRoutes.governanceGeneralInformation,
      exact: true,
    }),
  );

  if (match !== null) {
    return yield routeInternal({
      notAuth: undefined,
      investor: undefined,
      issuer: put(governanceModuleApi.actions.loadGeneralInformationView()),
      nominee: undefined,
    });
  }
}
