import BigNumber from "bignumber.js";

import {
  assertInvestorDashboard,
  closeModal,
  confirmAccessModal,
  createAndLoginNewUser,
  loginFixtureAccount,
  parseAmount,
  shouldDownloadDocument,
  tid,
} from "../../utils";
import { assertInvestorProposal, goToInvestorProposal } from "./utils";

const PROPOSAL_ID = "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220";

const getExpectedParticipationAfterShareholderVote = () =>
  cy
    .get(tid("governance.proposal.shareholder-vote-widget.percentage-of-tokens"))
    .then($element => parseAmount($element.text()))
    .then(percentageOfTokens =>
      cy
        .get(tid("governance.proposal.voting-details.participation-percentage"))
        .then($element => parseAmount($element.text()))
        .then(currentParticipation => percentageOfTokens.add(currentParticipation)),
    );

const assertParticipation = (expectedParticipation: BigNumber) => {
  cy.get(tid("governance.proposal.voting-details.participation-percentage"))
    .then($element => parseAmount($element.text()))
    .then(value => {
      // given that participation is and ulps value that we round we may loose precision in some edge cases
      expect(value.toNumber()).to.be.closeTo(expectedParticipation.toNumber(), 0.01);
    });
};

describe("Post investment voting", () => {
  it("should show a toast when proposal do not exist #governance #p3", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    });

    goToInvestorProposal("unknown-proposal");

    cy.get(tid("modules.shareholder-resolutions-voting-view.sagas.toast.unknown-proposal")).should(
      "exist",
    );
    assertInvestorDashboard();
  });

  it("should show a toast when investor has no access to proposal #governance #p3", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    });

    goToInvestorProposal(PROPOSAL_ID);

    cy.get(
      tid("modules.shareholder-resolutions-voting-view.sagas.toast.no-access-to-proposal"),
    ).should("exist");
    assertInvestorDashboard();
  });

  it("should snow proposal voting widget details #governance #p3", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC");

    goToInvestorProposal(PROPOSAL_ID);

    assertInvestorProposal();

    // proposal details
    shouldDownloadDocument(
      "governance.proposal.details.download-proposal",
      "General Meeting 2020 Resolution.pdf",
    );

    cy.get(tid("governance.proposal.shareholder-vote-widget.vote")).should("exist");

    // voting widget
    cy.get(tid("governance.proposal.shareholder-vote-widget.number-of-tokens")).should(
      "have.text",
      "4 920 916",
    );
    cy.get(tid("governance.proposal.shareholder-vote-widget.percentage-of-tokens")).should(
      "have.text",
      "44.05 %",
    );
  });

  it("should vote in favor #governance #p3", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC");

    goToInvestorProposal(PROPOSAL_ID);

    assertInvestorProposal();

    // save current voting state
    getExpectedParticipationAfterShareholderVote().as("expectedParticipation");

    cy.get(tid("governance.proposal.shareholder-vote-widget.vote-in-favor")).click();

    // confirm vote
    cy.get(tid("tx.shareholder-resolution-vote.summary.confirm")).click();

    confirmAccessModal();

    // wait for success
    cy.get(tid("modals.shared.tx-success.modal")).should("exist");
    closeModal();

    // assert view was refreshed with new state
    cy.get(tid("governance.proposal.shareholder-vote-widget.vote-details")).should("exist");

    // voting details widget
    cy.get(tid("governance.proposal.shareholder-vote-widget.vote")).contains("Yes");

    // voting details

    cy.get<BigNumber>("@expectedParticipation").then(expectedParticipation => {
      assertParticipation(expectedParticipation);
    });
  });

  it("should vote against #governance #p3", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP");

    goToInvestorProposal(PROPOSAL_ID);

    assertInvestorProposal();

    // save current voting state
    getExpectedParticipationAfterShareholderVote().as("expectedParticipation");

    cy.get(tid("governance.proposal.shareholder-vote-widget.vote-against")).click();

    // confirm vote
    cy.get(tid("tx.shareholder-resolution-vote.summary.confirm")).click();

    confirmAccessModal();

    // wait for success
    cy.get(tid("modals.shared.tx-success.modal")).should("exist");
    closeModal();

    // assert view was refreshed with new state
    cy.get(tid("governance.proposal.shareholder-vote-widget.vote-details")).should("exist");

    // voting details widget
    cy.get(tid("governance.proposal.shareholder-vote-widget.vote")).contains("No");

    // voting details
    cy.get<BigNumber>("@expectedParticipation").then(expectedParticipation => {
      assertParticipation(expectedParticipation);
    });
  });
});
