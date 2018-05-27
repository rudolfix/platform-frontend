import { tid } from "../../../../../test/testUtils";
import { get } from "lodash";

export const registerWithLightWallet = (email: string, password: string) => {
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();

  cy.url().should("contain", "/dashboard");
};

describe("Wallet backup recovery phrase", () => {
  it("should register user with light-wallet", () => {
    const email = "moe@test.com";
    const password = "strongpassword";

    const mockUrl = `${process.env.NF_REMOTE_BACKEND_PROXY_ROOT}external-services-mock/`;
    cy.request({ url: mockUrl + "/sendgrid/session/mails", method: "DELETE" });

    registerWithLightWallet(email, password);

    cy.request({ url: mockUrl + "/sendgrid/session/mails", method: "GET" }).then(r => {
      const email = get(r, 'body[0].personalizations[0].to[0]') as string | undefined;

      expect(email).to.be.eq(email);
    })
  });
});
