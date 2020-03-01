import { cyPromise } from "../../utils/cyPromise";
import {
  assertDashboard,
  assertLanding,
  assertLogin,
  goToDashboard,
  goToLanding,
  tid,
} from "../../utils/index";
import {
  createAndLoginNewUser,
  getJwtToken,
  getWalletMetaData,
  JWT_KEY,
  NF_USER_KEY,
  WALLET_STORAGE_KEY,
} from "../../utils/userHelpers";
import { keepSessionActive } from "../utils";

const REGISTRATION_LOGIN_DONE = "logged_in";
const AUTH_INACTIVITY_THRESHOLD = 300000;

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

describe("Login/Logout", () => {
  describe("Automatic Actions", () => {
    it("should logout automatically when a user has no activity @login @logout @p2", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        goToDashboard();
        const now = Date.now();
        cy.clock(now).then(clock => {
          clock.tick(AUTH_INACTIVITY_THRESHOLD / 2);
          assertDashboard();
          clock.tick(AUTH_INACTIVITY_THRESHOLD);
          assertLogin();
        });
      });
    });

    it("should not logout automatically when a user has activity @login @logout @p3", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        goToDashboard();
        const now = Date.now();
        cy.clock(now).then(clock => {
          cyPromise(() => {
            clock.tick(AUTH_INACTIVITY_THRESHOLD / 2);
            cy.get(tid("authorized-layout-wallet-button")).trigger("mousedown");
            return cy.get(tid("authorized-layout-wallet-button")).trigger("mouseleave");
          }).then(() => {
            clock.tick(AUTH_INACTIVITY_THRESHOLD / 2);
            assertDashboard();
          });
        });
      });
    });

    it("should not logout automatically when a user has activity in another tab @login @logout @p3", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        goToDashboard();
        const now = Date.now();

        cy.clock(now);

        keepSessionActive(AUTH_INACTIVITY_THRESHOLD * 1.5);

        assertDashboard();
      });
    });
  });
  describe("User Driven Actions", () => {
    it("should logout automatically when a user logs out from another tab @login @logout @p3", () => {
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
    it("should login automatically when a user logs-in from another tab @login @logout @p3", () => {
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
    it("should logout automatically when wallet Metadata is not present @login @logout @p3", () => {
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
    it("should redirect to landing page when NF_WALLET_METADATA is not present in the local storage @login @logout @p3", () => {
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
});
