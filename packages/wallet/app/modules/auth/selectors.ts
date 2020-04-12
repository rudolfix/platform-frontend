import { authModuleAPI } from "@neufund/shared-modules";
import { createSelector } from "reselect";
import { StateFromReducersMapObject } from "redux";
import { authReducerMap } from "./reducer";

const selectAuth = (state: StateFromReducersMapObject<typeof authReducerMap>) => state.auth;

const selectAuthState = createSelector(selectAuth, auth => auth.state);
const selectAuthWallet = createSelector(selectAuth, auth => auth.wallet);

const selectUser = (state: any) => authModuleAPI.selectors.selectUser(state);

export { selectAuthState, selectUser, selectAuthWallet };
