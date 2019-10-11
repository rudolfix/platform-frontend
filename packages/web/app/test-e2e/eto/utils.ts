import { find } from "lodash";

import { tid } from "../utils";

const ETOS_PATH = "/api/eto-listing/etos";
export const waitUntilEtoIsInState = async (etoId: string, state: string) => {
  while (true) {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(ETOS_PATH, {
      headers,
      method: "GET",
    });
    const etosJson = await response.json();
    const eto = find(etosJson, item => item.eto_id === etoId);
    if (eto.state === state && eto.start_date) {
      break;
    }
  }
};

export const assertInvestmentModal = () => {
  cy.get(tid("modals.investment.modal")).should("exist");
};
