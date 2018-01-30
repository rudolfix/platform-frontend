import { NavigateTo, NavigateToSymbol } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";

export const walletConnectedAction = injectableFn(
  (navigateTo: NavigateTo) => {
    navigateTo("/");
  },
  [NavigateToSymbol],
);
