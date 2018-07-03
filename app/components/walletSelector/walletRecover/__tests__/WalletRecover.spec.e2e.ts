import { get } from "lodash";
import { tid } from "../../../../../test/testUtils";
import { mockApiUrl } from "../../../../e2e-test-utils";
import { typeEmailPassword, typeLightwalletRecoveryPhrase } from "../../../../e2e-test-utils/index";

describe("Wallet recover", () => {
  const words = [
    "argue",
    "resemble",
    "sustain",
    "tattoo",
    "know",
    "goat",
    "parade",
    "idea",
    "science",
    "okay",
    "loan",
    "float",
    "solution",
    "used",
    "order",
    "dune",
    "essay",
    "achieve",
    "illness",
    "keen",
    "guitar",
    "stumble",
    "idea",
    "strike",
  ];

  const expectedGeneratedAddress = "0x429123b08df32b0006fd1f3b0ef893a8993802f3";

  it("should recover wallet from saved phrases", () => {
    cy.visit("/recover/seed");

    typeLightwalletRecoveryPhrase(words);

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });

    cy.get(tid("wallet-selector-register-email")).type("john-smith@example.com");
    cy.get(tid("wallet-selector-register-password")).type("strongpassword");
    cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");
    cy.wait(2000);

    cy.get(tid("recovery-success-btn-go-dashboard")).click();

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
      const email = get(r, "body[0].personalizations[0].to[0]") as string | undefined;
      const loginLink = get(r, "body[0].personalizations[0].substitutions.-loginLink-") as
        | string
        | undefined;

      expect(email).to.be.eq(email);
      expect(loginLink).to.contain("salt");
    });

    cy.contains(tid("my-neu-widget-neumark-balance"), "57611.8506 NEU");

    cy.contains(tid("my-wallet-widget-eur-token-large-value"), "nEUR0.00");
    cy.contains(tid("my-wallet-widget-eur-token-value"), "0.00 EUR");

    cy.contains(tid("my-wallet-widget-eth-token-large-value"), "ETH999 938.8591");
    cy.contains(tid("my-wallet-widget-eth-token-value"), "483 930 410.24 EUR");

    cy.get(tid("authorized-layout-settings-button")).click();

    cy.get(tid("your-ether-address-widget-eth-address")).then(address => {
      expect(address.text()).to.be.eq(expectedGeneratedAddress);
    });
  });

  it.only("should return an error when recovering seed and using an already verified email", () => {
    const words = [
      "argue",
      "resemble",
      "sustain",
      "tattoo",
      "know",
      "goat",
      "parade",
      "idea",
      "science",
      "okay",
      "loan",
      "float",
      "solution",
      "used",
      "order",
      "dune",
      "essay",
      "achieve",
      "illness",
      "keen",
      "guitar",
      "stumble",
      "idea",
      "strike",
    ];

    //@see https://github.com/Neufund/platform-backend/tree/master/deploy#dev-fixtures
    const email = "0xE6Ad2@neufund.org";
    const password = "strongpassword";
    const errorMessage = "Error";

    cy.visit("/recover/seed");
    typeLightwalletRecoveryPhrase(words);
    typeEmailPassword(email, password);
    cy.wait(2000);
    cy
      .get(tid("components.modals.generic-modal.title"))
      .then(errorMsg => expect(errorMsg.text()).to.contain(errorMessage));
  });
});
