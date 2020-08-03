import PrivateKeyProvider from "truffle-privatekey-provider";

import { remove0x } from "../../../modules/web3/utils";
import { NODE_ADDRESS } from "../../config";
import {
  accountFixturePrivateKey,
  confirmAccessModal,
  ethereumProvider,
  goToGeneralInformation,
  loginFixtureAccount,
  tid,
} from "../../utils";

describe("Governance General Information page", () => {
  const ISSUER_SETUP_NODE_PROVIDER = new PrivateKeyProvider(
    remove0x(accountFixturePrivateKey("ISSUER_PAYOUT")),
    NODE_ADDRESS,
  );

  it("Publish new update", () => {
    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);
    loginFixtureAccount("ISSUER_PAYOUT", {}).then(() => {
      goToGeneralInformation();
      cy.get(tid("governance-add-new-update")).click();
      cy.get(tid("governance-update-title")).type("Company Update July 2020");
      cy.get(tid("multi-file-upload-dropzone")).dropFiles(["example.pdf"]);
      cy.get(tid("general-information-publish")).click();
      cy.get(tid("tx.shareholder-resolution-vote.summary.confirm")).click();
      confirmAccessModal();
    });
  });
});
