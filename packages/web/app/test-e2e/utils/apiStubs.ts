/**
 * This file is concerned will all the API call that will be stubbed by our backend
 *
 * @see https://docs.cypress.io/api/commands/route.html#With-Stubbing
 *
 * @note You will need to use `cy.server()` before any of these calls
 */

/**
 * A test utility method that stubs a challenge API Call with
 *
 */
export const stubChallengeApiRequest = (response: any, status: number) => {
  cy.route({ method: "POST", url: "**/jwt/challenge", response, status });
};
