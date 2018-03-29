import { appRoutes } from "../AppRouter";

export const parentRoutePath = appRoutes.wallet;

export const walletRoutes = {
  euroToken: parentRoutePath + "/deposit/neur",
  eth: parentRoutePath + "/deposit/eth",
  manageWallet: parentRoutePath + "/manage-wallet",
};
