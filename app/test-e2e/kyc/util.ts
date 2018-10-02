import { tid } from "../utils";
import { DEFAULT_PASSWORD } from "../utils/userHelpers";

export const acceptWallet = () => {
  cy.get(tid("access-light-wallet-password-input")).type(DEFAULT_PASSWORD);
  // for some reason we have to wait for 2 seconds before this button works...
  cy.wait(2000);
  cy.get(tid("access-light-wallet-confirm")).click();
};
