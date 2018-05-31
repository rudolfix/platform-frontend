import { tid } from "../../../../../test/testUtils";
import { assertEtoDashboard, registerWithLightWalletETO } from "./LightWalletETORegister.spec.e2e";

const testEmail = "moe@test.com";
const password = "strongpassword";

const loginWithLightWalletETO = (testEmail: string, password: string) => {
  registerWithLightWalletETO(testEmail, password);

  cy.get(tid("Header-logout")).click();
  cy.get(tid("Header-login-eto")).click();
  cy.get(tid("wallet-selector-light")).click();

  cy.contains(tid("wallet-selector-nuewallet.login-email"), testEmail);
  cy.get(tid("wallet-selector-nuewallet.login-password")).type(password);
  cy.get(tid("wallet-selector-nuewallet.login-button")).click();

  assertEtoDashboard();
};

describe("Light Wallet ETO Login", () => {
  it("should register logout then login as an investor", () => {
    loginWithLightWalletETO(testEmail, password);
  });
  it("should login/logout as investor navigate to ETO then login/logout as issuer", () => {
    loginWithLightWalletETO(testEmail, password);
  });
});
