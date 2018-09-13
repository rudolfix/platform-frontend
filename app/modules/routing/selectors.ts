import * as queryString from "query-string";
import { RouterState } from "react-router-redux";

export const selectRedirectURLFromQueryString = (state: RouterState): string | undefined => {
  if (!(state.location && state.location.search)) {
    return undefined;
  }
  const params = queryString.parse(state.location.search);
  const redirect = params.redirect;

  if (!redirect) {
    return undefined;
  }

  return redirect;
};
