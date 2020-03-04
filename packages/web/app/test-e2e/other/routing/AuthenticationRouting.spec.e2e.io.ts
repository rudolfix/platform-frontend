import {
  assertLanding,
  assertUserInBrowserWalletLoginPage,
  assertUserInLedgerWalletLoginPage,
  assertUserInLightWalletLoginPage,
  assertUserInRecoveryPage,
} from "../../utils/index";

describe("Authentication Routing", () => {
  it("should open login with light wallet #routing #p3", () => {
    cy.visit("/login");
    assertUserInLightWalletLoginPage();
  });

  it("should redirect to login from /eto/login #routing #p3", () => {
    cy.visit("/eto/login");
    assertUserInLightWalletLoginPage();
  });

  it("should redirect to /restore from /eto/restore #routing #p3", () => {
    cy.visit("/eto/restore");
    assertUserInRecoveryPage();
  });

  it("should open email activation link with light wallet when wallet type is unknown #routing #p2", () => {
    cy.visit(
      "/email-verify?code=8ce11ded-e1ff-4bfa-b05a-87ea119474ff&email=0xfcd9b%40neufund.org&user_type=issuer&wallet_type=unknown",
    );
    assertUserInLightWalletLoginPage();
  });

  it("should open email activation link with light wallet #routing #p1", () => {
    cy.visit(
      "/email-verify?code=8ce11ded-e1ff-4bfa-b05a-87ea119474ff&email=0xfcd9b%40neufund.org&user_type=issuer&wallet_type=light",
    );
    assertUserInLightWalletLoginPage();
  });

  it("should open email activation link with browser wallet #routing #p1", () => {
    cy.visit(
      "/email-verify?code=8ce11ded-e1ff-4bfa-b05a-87ea119474ff&email=0xfcd9b%40neufund.org&user_type=issuer&wallet_type=browser",
    );
    assertUserInBrowserWalletLoginPage();
  });

  it("should open email activation link with ledger wallet #routing #p1", () => {
    cy.visit(
      "/email-verify?code=8ce11ded-e1ff-4bfa-b05a-87ea119474ff&email=0xfcd9b%40neufund.org&user_type=issuer&wallet_type=ledger",
    );
    assertUserInLedgerWalletLoginPage();
  });

  it("should redirect to root page if the link is wrong #routing #p3", () => {
    cy.visit("/haha-im-a-wrong-link");
    assertLanding();
  });
});
