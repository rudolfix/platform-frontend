import { assertDashboard, assertLanding, goToDashboard, goToLanding } from "../utils";
import {
  createAndLoginNewUser,
  getJwtToken,
  getWalletMetaData,
  JWT_KEY,
  NF_USER_KEY,
  WALLET_STORAGE_KEY,
} from "../utils/userHelpers";

const REGISTRATION_LOGIN_DONE = "logged_in";

const clearKeyFromStorageWithEvents = (Window: Window, key: string) => {
  Window.dispatchEvent(
    new StorageEvent("storage", {
      key,
      oldValue: Window.localStorage.getItem(key),
      newValue: undefined,
    }),
  );
  Window.localStorage.removeItem(key);
};
const setKeyFromStorageWithEvents = (Window: Window, key: string, newValue: string) => {
  const oldValue = Window.localStorage.getItem(key);
  Window.localStorage.setItem(key, newValue);
  Window.dispatchEvent(
    new StorageEvent("storage", {
      key,
      newValue,
      oldValue,
    }),
  );
};

describe("auto-logout/auto-login", () => {
  it("should logout automatically when a user logs out from another tab", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();

      cy.window().then(Window => {
        clearKeyFromStorageWithEvents(Window, JWT_KEY);
        assertLanding();
      });
    });
  });
  it("should login automatically when a user logs-in from another tab", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      const jwt = getJwtToken();
      const walletData = getWalletMetaData();
      cy.clearLocalStorage();
      goToLanding();
      cy.window().then(Window => {
        setKeyFromStorageWithEvents(Window, WALLET_STORAGE_KEY, JSON.stringify(walletData));
        setKeyFromStorageWithEvents(Window, JWT_KEY, JSON.stringify(jwt));
        setKeyFromStorageWithEvents(Window, NF_USER_KEY, JSON.stringify(REGISTRATION_LOGIN_DONE));
        assertDashboard();
      });
    });
  });
  it("should logout automatically when wallet Metadata is not present", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();
      cy.window().then(Window => {
        clearKeyFromStorageWithEvents(Window, WALLET_STORAGE_KEY);
        assertLanding();
      });
    });
  });
  it("should not start app when metadata is not present", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();
      cy.window().then(Window => {
        Window.localStorage.removeItem(WALLET_STORAGE_KEY);
        goToDashboard(false);
        assertLanding();
      });
    });
  });
});
