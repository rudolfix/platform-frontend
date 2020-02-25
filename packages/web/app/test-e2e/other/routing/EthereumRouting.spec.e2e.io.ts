import PrivateKeyProvider from "truffle-privatekey-provider";

import { remove0x } from "../../../modules/web3/utils";
import { NODE_ADDRESS } from "../../config";
import {
  accountFixtureAddress,
  accountFixturePrivateKey,
  assertIssuerDashboard,
  ethereumProvider,
  goToWallet,
  tid,
} from "../../utils/index";
import { goToLanding } from "../../utils/navigation";

const ISSUER_SETUP = "ISSUER_SETUP";

const ISSUER_SETUP_NODE_PROVIDER = new PrivateKeyProvider(
  remove0x(accountFixturePrivateKey(ISSUER_SETUP)),
  NODE_ADDRESS,
);

const ISSUER_SETUP_MAIN_NODE_PROVIDER = new PrivateKeyProvider(
  remove0x(accountFixturePrivateKey(ISSUER_SETUP)),
  "https://mainnet.infura.io/v3/ddfed355869142b09396d38dfe4c886d",
);

describe("Ethereum Routing", () => {
  it("should login as issuer with browser wallet @routing @p3", () => {
    goToLanding();

    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();

    cy.get(tid("wallet-selector-browser")).click();

    assertIssuerDashboard();

    goToWallet();

    cy.get(tid("account-address.your.ether-address.from-div"))
      .invoke("text")
      .then(value => {
        expect(value).to.equal(accountFixtureAddress(ISSUER_SETUP));
      });
  });

  it("should show error message when node doesn't match platform node @routing @p3", () => {
    goToLanding();

    ethereumProvider(ISSUER_SETUP_MAIN_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();

    cy.get(tid("wallet-selector-browser")).click();

    cy.get(tid("browser-wallet-error-msg")).should("exist");

    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);

    cy.get(tid("browser-wallet-init.try-again")).click();

    assertIssuerDashboard();
  });
});
