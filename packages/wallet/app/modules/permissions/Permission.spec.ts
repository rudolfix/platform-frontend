import { Permissions, permissionsStatuses } from "./Permissions";
import { noopLogger } from "@neufund/shared-modules";

describe("Permissions", () => {
  let permissions: Permissions;

  beforeEach(() => {
    permissions = new Permissions(noopLogger);
  });

  it("should ask for push notifications permissions", async () => {
    const notificationsAllowed = await permissions.requestNotificationsPermissions();
    expect(notificationsAllowed.status).toBe(permissionsStatuses.granted);
  });
});
