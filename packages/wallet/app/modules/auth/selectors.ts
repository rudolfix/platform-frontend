import { authModuleAPI } from "@neufund/shared-modules";
import { createSelector } from "reselect";

const selectAuth = (state: any) => state.auth;

const selectAuthState = createSelector(selectAuth, auth => auth.state);

const selectUser = (state: any) => authModuleAPI.selectors.selectUser(state);

export { selectAuthState, selectUser };
