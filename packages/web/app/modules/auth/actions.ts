import { emailActions } from "./email/actions";
import { authUserActions } from "./user/actions";
import { authWatcherActions } from "./watcher/actions";

export const authActions = {
  ...emailActions,
  ...authUserActions,
  ...authWatcherActions,
};
