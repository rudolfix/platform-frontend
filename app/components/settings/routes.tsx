import { appRoutes } from "../AppRouter";

const parentRoutePath = appRoutes.settings;

export const settingsRoutes = {
  seedBackup: parentRoutePath + "/seed-backup",
};
