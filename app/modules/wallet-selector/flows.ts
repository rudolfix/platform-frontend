import { APP_DISPATCH_SYMBOL, NAVIGATE_TO_SYMBOL, NavigateTo } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { obtainJwt } from "../networking/jwt-actions";
import { browserWizzardFlows } from "./browser-wizard/flows";
import { ledgerWizzardFlows } from "./ledger-wizard/flows";
import { lightWizzardFlows } from "./light-wizard/flows";

export const walletFlows = {
  walletConnected: injectableFn(
    async (navigateTo: NavigateTo, dispatch: AppDispatch) => {
      // we need to improve dispatch signature so types flow correctly
      // tslint:disable-next-line
      await dispatch(obtainJwt);
      navigateTo("/");
    },
    [NAVIGATE_TO_SYMBOL, APP_DISPATCH_SYMBOL],
  ),
  ...browserWizzardFlows,
  ...ledgerWizzardFlows,
  ...lightWizzardFlows,
};
