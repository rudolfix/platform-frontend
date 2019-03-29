// an easy (and recommended by cypress) way to use cy promise and be able to call async functions in then()
// @see https://docs.cypress.io/api/utilities/promise.html#Waiting-for-Promises
export const cyPromise = (fn: Function) => cy.wrap(null).then(() => fn());
