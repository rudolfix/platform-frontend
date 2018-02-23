import { appRoutes } from "../../AppRouter";

const parentRoutePath = appRoutes.recover;

export const walletRecoverRoutes = {
  seed: parentRoutePath + "/seed",
  done: parentRoutePath + "/done",
  create: parentRoutePath + "/create",
  help: parentRoutePath + "/help",
};
