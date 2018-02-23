import { appRoutes } from "../../AppRouter";

const parentRoutePath = appRoutes.recover;

export const recoverRoutes = {
  success: parentRoutePath + "/success",
  recover: parentRoutePath + "/recover",
  help: parentRoutePath + "/help",
};
