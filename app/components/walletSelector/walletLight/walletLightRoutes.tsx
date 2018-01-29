import { walletRoutes } from "../walletRoutes";

const parentRoutePath = walletRoutes.light;

export const walletLightRoutes = {
  create: parentRoutePath + "/create",
  recover: parentRoutePath + "/recover",
  validate: parentRoutePath + "/validate",
};
