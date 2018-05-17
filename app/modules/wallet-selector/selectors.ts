import { RouterState } from "react-router-redux";
import { appRoutes } from "../../components/appRoutes";
import { TUserType } from "../../lib/api/users/interfaces";

export const selectUrlUserType = (router: RouterState): TUserType =>
  router.location && router.location.pathname.includes("eto") ? "issuer" : "investor";

export const selectIsLoginRoute = (state: RouterState): boolean =>
  !!state.location && state.location.pathname.includes("login");

export const selectRootPath = (state: RouterState): string => {
  if (selectUrlUserType(state) === "investor") {
    return selectIsLoginRoute(state) ? appRoutes.login : appRoutes.register;
  } else {
    return selectIsLoginRoute(state) ? appRoutes.loginEto : appRoutes.registerEto;
  }
};

export const selectOppositeRootPath = (state: RouterState): string => {
  if (selectUrlUserType(state) === "investor") {
    return selectIsLoginRoute(state) ? appRoutes.register : appRoutes.login;
  } else {
    return selectIsLoginRoute(state) ? appRoutes.registerEto : appRoutes.loginEto;
  }
};

export const selectLocation = (router: RouterState): any => router.location;
