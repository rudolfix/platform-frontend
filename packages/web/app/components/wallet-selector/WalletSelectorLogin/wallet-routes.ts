import { appRoutes } from "../../appRoutes";

const parentLoginRoutePath = appRoutes.login;
export const walletLoginRoutes = {
  light: parentLoginRoutePath + "/light",
  browser: parentLoginRoutePath + "/browser",
  ledger: parentLoginRoutePath + "/ledger",
};
