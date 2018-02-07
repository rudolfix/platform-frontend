import { DispatchSymbol, NavigateTo, NavigateToSymbol } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { obtainJwt } from "../networking/jwt-actions";

export const walletConnectedAction = injectableFn(
  async (navigateTo: NavigateTo, dispatch: AppDispatch) => {
    // we need to improve dispatch signature so types flow correctly
    // tslint:disable-next-line
    await dispatch(obtainJwt);
    navigateTo("/");
  },
  [NavigateToSymbol, DispatchSymbol],
);
