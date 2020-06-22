import {
  assertIssuerDashboard,
  createAndLoginNewUser,
  loginFixtureAccount,
  tid,
} from "../../utils";
import { assertIssuerProposal, goToIssuerProposal } from "./utils";

const PROPOSAL_ID = "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220";

describe("Post investment voting", () => {
  it("should show a toast when proposal do not exist #governance #p3", () => {
    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
    });

    goToIssuerProposal("unknown-proposal");

    cy.get(tid("modules.shareholder-resolutions-voting-view.sagas.toast.unknown-proposal")).should(
      "exist",
    );

    assertIssuerDashboard();
  });

  it("should show a toast when issuer has no access to proposal #governance #p3", () => {
    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
    });

    goToIssuerProposal(PROPOSAL_ID);

    cy.get(tid("modules.shareholder-resolutions-voting-view.sagas.toast.unknown-proposal")).should(
      "exist",
    );

    assertIssuerDashboard();
  });

  it("should not show proposal voting widget for issuer #governance #p3", () => {
    loginFixtureAccount("ISSUER_PAYOUT");

    goToIssuerProposal(PROPOSAL_ID);

    assertIssuerProposal();

    // assert voting widget is not visible for issuer
    cy.get(tid("governance.proposal.shareholder-vote-widget.vote")).should("not.exist");
    cy.get(tid("governance.proposal.shareholder-vote-widget.vote-details")).should("not.exist");
  });
});
