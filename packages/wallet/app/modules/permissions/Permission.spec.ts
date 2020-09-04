import { noopLogger } from "@neufund/shared-modules";

import { Permissions } from "./Permissions";
import { PERMISSIONS, PERMISSION_RESULTS } from "./module";

describe("Permissions", () => {
  let permissions: Permissions;

  beforeEach(() => {
    permissions = new Permissions(noopLogger);
  });

  it("should ask for push notifications permissions", async () => {
    const notificationsAllowed = await permissions.requestNotificationsPermissions();
    expect(notificationsAllowed.status).toBe(PERMISSION_RESULTS.GRANTED);
  });

  it("should check permissions", async () => {
    const status = await permissions.check(PERMISSIONS.IOS.FACE_ID);

    expect(status).toBe(PERMISSION_RESULTS.GRANTED);
  });

  it("should request permissions", async () => {
    const status = await permissions.request(PERMISSIONS.ANDROID.CAMERA);

    expect(status).toBe(PERMISSION_RESULTS.GRANTED);
  });
});
