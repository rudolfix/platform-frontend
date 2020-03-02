import { assertUserInBrowserWalletLoginPage } from "../utils/assertions";
import {
  goToLoginLightWalletWithMockedWeb3,
  goToLoginWithMockedWeb3,
  goToRegisterLightWalletWithMockedWeb3,
  goToRegisterWithMockedWeb3,
} from "../utils/navigation";

describe("Redirect user with browser wallet", () => {
  it("should redirect to /login/browser", () => {
    goToLoginWithMockedWeb3();

    assertUserInBrowserWalletLoginPage();

    goToLoginLightWalletWithMockedWeb3();

    assertUserInBrowserWalletLoginPage();
  });

  it("should redirect to /register/browser", () => {
    goToRegisterWithMockedWeb3();

    // This asserts browser wallet error msg
    assertUserInBrowserWalletLoginPage();

    goToRegisterLightWalletWithMockedWeb3();

    assertUserInBrowserWalletLoginPage();
  });
});
