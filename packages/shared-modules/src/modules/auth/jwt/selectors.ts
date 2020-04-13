import { StateFromReducersMapObject } from "redux";

import { jwtReducerMap } from "./reducer";

const selectJwt = (state: StateFromReducersMapObject<typeof jwtReducerMap>): string | undefined =>
  state.jwt.token;

export { selectJwt };
