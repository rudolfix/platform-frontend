import { NavigateTo } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { obtainJwt } from "../networking/jwt-actions";
import { browserWizardFlows } from "./browser-wizard/flows";
import { ledgerWizardFlows } from "./ledger-wizard/flows";
import { lightWizardFlows } from "./light-wizard/flows";

export const walletFlows = {
  walletConnected: injectableFn(
    async (navigateTo: NavigateTo, dispatch: AppDispatch) => {
      // we need to improve dispatch signature so types flow correctly
      // tslint:disable-next-line
      await dispatch(obtainJwt);
      navigateTo("/");
    },
    [symbols.navigateTo, symbols.appDispatch],
  ),
  ...browserWizardFlows,
  ...ledgerWizardFlows,
  ...lightWizardFlows,
};
