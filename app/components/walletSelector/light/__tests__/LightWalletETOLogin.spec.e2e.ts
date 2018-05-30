import { tid } from "../../../../../test/testUtils";
import { registerWithLightWalletETO } from "./LightWalletETORegister.spec.e2e";

const testEmail = "moe@test.com";

describe("Light Wallet Login", () => {
  it("should load user meta only from issuer path", () => {
    registerWithLightWalletETO(testEmail, "strongpassword");

    cy.get(tid("Header-logout")).click();
    cy.get(tid("Header-login-eto")).click();
    cy.get(tid("wallet-selector-light")).click();

    cy.contains(tid("wallet-selector-nuewallet.login-email"), testEmail);
  });
});
