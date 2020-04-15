import { TReducersMapToState, TReducersMapToActions } from "@neufund/sagas";

import { appReducers } from "../modules/reducers";

export type TAppGlobalState = TReducersMapToState<typeof appReducers>;
export type TAppGlobalActions = TReducersMapToActions<typeof appReducers>;
