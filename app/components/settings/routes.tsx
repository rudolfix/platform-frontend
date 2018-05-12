import { appRoutes } from "../appRoutes";

const parentRoutePath = appRoutes.settings;

export const settingsRoutes = {
  seedBackup: parentRoutePath + "/seed-backup",
};
