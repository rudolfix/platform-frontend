import { tid } from "../utils";

export const assertEtoView = (title: string) => {
  cy.get(tid("eto.public-view")).should("exist");
  cy.title().should("eq", title + " - Neufund Platform");
};
