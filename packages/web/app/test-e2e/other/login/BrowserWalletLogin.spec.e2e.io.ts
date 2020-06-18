import PrivateKeyProvider from "truffle-privatekey-provider";

import { makeEthereumAddressChecksummed, remove0x } from "../../../modules/web3/utils";
import { NODE_ADDRESS } from "../../config";
import { stubChallengeApiRequest } from "../../utils/apiStubs";
import { assertDashboard } from "../../utils/assertions";
import { generateRandomPrivateKey } from "../../utils/e2eWeb3Utils";
import {
  accountFixturePrivateKey,
  assertIssuerDashboard,
  ethereumProvider,
  generateRandomEmailAddress,
  goToWallet,
  tid,
} from "../../utils/index";
import { goToLanding } from "../../utils/navigation";

const ISSUER_SETUP = "ISSUER_SETUP";

const ISSUER_SETUP_NODE_PROVIDER = new PrivateKeyProvider(
  remove0x(accountFixturePrivateKey(ISSUER_SETUP)),
  NODE_ADDRESS,
);

const NEW_INVESTOR_NODE_PROVIDER = new PrivateKeyProvider(
  remove0x(generateRandomPrivateKey()),
  NODE_ADDRESS,
);

const ISSUER_SETUP_MAIN_NODE_PROVIDER = new PrivateKeyProvider(
  remove0x(accountFixturePrivateKey(ISSUER_SETUP)),
  "https://mainnet.infura.io/v3/ddfed355869142b09396d38dfe4c886d",
);
describe("Ethereum Routing", () => {
  it("should register as issuer with browser wallet #browserWallet #p2", () => {
    goToLanding();
    ethereumProvider(NEW_INVESTOR_NODE_PROVIDER);
    cy.get(tid("Header-register")).click();

    cy.get(tid("wallet-selector-register-email")).type(generateRandomEmailAddress());
    cy.get(tid("wallet-selector-register-tos")).click();
    cy.get(tid("wallet-selector-register-button")).click();
    cy.get(tid("unverified-email-reminder-modal-ok-button")).click();

    assertDashboard();

    goToWallet();

    cy.get(tid("account-address.your.ether-address.from-div.trigger")).should(
      "have.text",
      makeEthereumAddressChecksummed(NEW_INVESTOR_NODE_PROVIDER.address),
    );
  });

  it("should login as issuer with browser wallet #browserWallet #p2", () => {
    goToLanding();

    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();
    cy.get(tid("wallet-selector-browser")).click();

    assertIssuerDashboard();
    goToWallet();

    cy.get(tid("account-address.your.ether-address.from-div.trigger")).should(
      "have.text",
      makeEthereumAddressChecksummed(ISSUER_SETUP_NODE_PROVIDER.address),
    );
  });

  it("should work on retry after exception #browserWallet #p3", () => {
    cy.server();
    stubChallengeApiRequest({}, 405);
    goToLanding();

    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();
    cy.get(tid("wallet-selector-browser")).click();
    cy.get(tid("browser-wallet-error-msg")).should("exist");

    cy.server({ enable: false });

    cy.get(tid("browser-wallet-init.try-again")).click();

    cy.get(tid("eto-issuer-state"));
  });

  it("should show error message #browserWallet #p3", () => {
    cy.server();
    stubChallengeApiRequest({}, 405);
    goToLanding();

    ethereumProvider(NEW_INVESTOR_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();

    cy.get(tid("wallet-selector-browser")).click();
    cy.get(tid("browser-wallet-error-msg")).should("exist");

    cy.get(tid("browser-wallet-init.try-again")).click();
    cy.get(tid("loading-indicator-pulse")).should("exist");
    cy.get(tid("browser-wallet-error-msg")).should("exist");
  });

  it("should show error message when node doesn't match platform node #browserWallet #p3", () => {
    goToLanding();

    ethereumProvider(ISSUER_SETUP_MAIN_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();
    cy.get(tid("wallet-selector-browser")).click();
    cy.get(tid("browser-wallet-error-msg")).should("exist");

    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);

    cy.get(tid("browser-wallet-init.try-again")).click();
    assertIssuerDashboard();
  });

  it("should show error #browserWallet #p3", () => {
    cy.window().then(win => {
      (win as any).ethereum = undefined;

      goToLanding();

      cy.get(tid("Header-login")).click();
      cy.get(tid("wallet-selector-browser")).click();
      cy.get(tid("browser-wallet-error-msg")).should("exist");
    });
  });
});
