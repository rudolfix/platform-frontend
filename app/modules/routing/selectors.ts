import { RouterState } from "react-router-redux";
import { appRoutes } from "../../components/AppRouter";

export const isLoginRoute = (state: RouterState): boolean =>
  !!state.location && state.location.pathname.startsWith(appRoutes.login);
