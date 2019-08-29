import { isFunction } from "lodash/fp";

import { toCamelCase } from "../../utils/transformObjectKeys";
import { withParams } from "../../utils/withParams";
import { acceptWallet } from "../utils";
import { assertIssuerDashboard } from "../utils/assertions";
import { cyPromise } from "../utils/cyPromise";
import { fillForm, TFormFixture } from "../utils/forms";
import { confirmAccessModal } from "../utils/index";
import { goToIssuerDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createUser, makeAuthenticatedCall } from "../utils/userHelpers";
import {
  aboutFormRequired,
  aboutFormSubmit,
  equityTokenInfoForm,
  legalInfoRequiredForm,
  mediaRequiredForm,
} from "./fixtures";

export const submitProposal = () => {
  goToIssuerDashboard();

  cy.get(tid("eto-dashboard-submit-proposal")).click();
  acceptWallet();

  cy.get(tid("eto-state-pending")).should("exist");
};

export const submitPreview = () => {
  goToIssuerDashboard();

  cy.get(tid("eto-dashboard-publish-eto")).click();

  acceptWallet();

  cy.get(tid("eto-dashboard-publish-eto")).should("not.exist");
};

export const fillAndAssertFull = (section: string, sideEffect: TFormFixture | (() => void)) => {
  cy.get(`${tid(section)} button`).click();

  if (isFunction(sideEffect)) {
    sideEffect();
  } else {
    fillForm(sideEffect);
  }

  assertIssuerDashboard();
  cy.get(`${tid(section)} ${tid("chart-circle.progress")}`).should("contain", "100%");
};

export const goToSection = (section: string) => {
  cy.get(`${tid(section)} button`).click();
};

export const fillAndAssert = (section: string, sectionForm: TFormFixture) => {
  goToSection(section);

  fillForm(sectionForm);

  assertIssuerDashboard();
};

/**
 * Creates new nominee and connects it's to issuer eto
 */
export const createAndSetNominee = () =>
  cyPromise(async () => {
    const [etoId, nominee] = await Promise.all([
      getIssuerEtoId(),
      createUser("nominee", undefined, "business"),
    ]);

    setEtoNominee(etoId, nominee.address);
  });

const ETO_ME_PATH = "/api/eto-listing/etos/me";

/**
 * Get current logged in issuer eto id
 */
export const getIssuerEtoId = (): Promise<string> =>
  makeAuthenticatedCall(ETO_ME_PATH)
    .then(toCamelCase)
    .then(response => response.etoId);

const SET_ETO_NOMINEE_PATH =
  "/api/external-services-mock/e2e-tests/etos/:etoId/nominees/:nomineeId";

/**
 * Assigns nominee to eto programmatically
 * @param etoId
 * @param nomineeId
 */
const setEtoNominee = (etoId: string, nomineeId: string) => {
  const path = withParams(SET_ETO_NOMINEE_PATH, { etoId, nomineeId });

  return cy.request("PUT", path);
};

export const fillRequiredCompanyInformation = () => {
  goToIssuerDashboard();

  fillAndAssert("eto-progress-widget-about", {
    ...aboutFormRequired,
    ...aboutFormSubmit,
  });

  fillAndAssert("eto-progress-widget-legal-info", legalInfoRequiredForm);

  fillAndAssert("eto-progress-widget-media", mediaRequiredForm);

  fillAndAssert("eto-progress-widget-equity-token-info", equityTokenInfoForm);
};

export const acceptNominee = (address: string) => {
  goToSection("eto-progress-widget-voting-right");

  cy.get(tid("eto-nominee-accept")).click();

  confirmAccessModal();

  cy.get(tid(`chosen-nominee-${address}`)).should("exist");
};

export const cancelNominee = (address: string) => {
  cy.get(tid(`chosen-nominee-${address}`))
    .find(tid("delete-nominee-request"))
    .click();

  confirmAccessModal();

  cy.get(tid("no-pending-nominee-requests")).should("exist");
};

export const rejectNominee = () => {
  goToSection("eto-progress-widget-voting-right");

  cy.get(tid("eto-nominee-reject")).click();

  confirmAccessModal();

  cy.get(tid("no-pending-nominee-requests")).should("exist");
};

export const assertSetupEtoStep = () => {
  // eto state should be still in preview
  cy.get(tid("eto-state-preview")).should("exist");
  // step should be moved to setup eto
  cy.get(tid("eto-dashboard-setup-eto")).should("exist");
};

export const assertLinkNomineeStep = () => {
  cy.get(tid("eto-state-preview")).should("exist");
  cy.get(tid("eto-dashboard-link-nominee")).should("exist");
};

export const assertLinkNomineeStepAwaitingRequestState = (issuerAddress: string) => {
  assertLinkNomineeStep();

  cy.get(tid("issuer-id")).should("have.text", issuerAddress);
};

export const assertLinkNomineeStepAwaitingApprovalState = () => {
  assertLinkNomineeStep();

  cy.get(tid("eto-dashboard-accept-nominee")).should("exist");
};
