import { put } from "@neufund/sagas";

import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { actions } from "../../actions";

export function* ensureEtoJurisdiction(
  etoJurisdiction: EJurisdiction,
  routJurisdiction: EJurisdiction,
): Generator<any, any, any> {
  if (etoJurisdiction !== routJurisdiction) {
    // TODO: Add 404 page
    yield put(actions.routing.goTo404());
  }
}
