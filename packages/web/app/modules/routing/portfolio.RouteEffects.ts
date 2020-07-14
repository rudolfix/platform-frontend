import { put } from "@neufund/sagas";
import { RouterState } from "connected-react-router";
import { matchPath } from "react-router-dom";

import { appRoutes } from "../../components/appRoutes";
import { actions } from "../actions";
import { routeAction } from "./sagas";

export function* portfolioRoute(payload: RouterState): Generator<any, any, any> {
  const portfolioMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.portfolio,
  });
  return yield routeAction(portfolioMatch, {
    notAuth: undefined,
    investor: undefined,
    issuer: put(actions.routing.goToDashboard()),
    nominee: put(actions.routing.goToDashboard()),
  });
}

export function* portfolioDetailsRoute(payload: RouterState): Generator<any, any, any> {
  const portfolioMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.portfolioDetails,
  });
  return yield routeAction(portfolioMatch, {
    notAuth: undefined,
    investor: undefined,
    issuer: put(actions.routing.goToDashboard()),
    nominee: put(actions.routing.goToDashboard()),
  });
}
