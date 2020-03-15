import { EUserType } from "../../../lib/api/users/interfaces";
import { put, PutEffect } from "@neufund/sagas";
import { actions } from "../../actions";
import { CallHistoryMethodAction } from "connected-react-router";
export function walletSelectorRegisterRedirect(userType: EUserType): PutEffect<CallHistoryMethodAction> {
  switch (userType) {
    case EUserType.INVESTOR:
      return put(actions.routing.goToLightWalletRegister());
    case EUserType.ISSUER:
      return put(actions.routing.goToIssuerLightWalletRegister());
    case EUserType.NOMINEE:
      return put(actions.routing.goToNomineeLightWalletRegister());
  }
}
