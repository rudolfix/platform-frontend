import { Permissions, permissionsStatuses } from "./Permissions";
import { ILogger, noopLogger } from "@neufund/shared-modules";

describe("Permissions", () => {
  let permissions: Permissions;
  let logger: ILogger;

  beforeEach(() => {
    logger = noopLogger;
    permissions = new Permissions(logger);
  });

  it("should ask for push notifications permissions", async () => {
    const notificationsAllowed = await permissions.requestNotificationsPermissions();
    expect(notificationsAllowed.status).toBe(permissionsStatuses.granted);
  });
});
