declare namespace Cypress {
  // noinspection TsLint
  interface Chainable<Subject = any> {
    dropFiles: (fixtures: string[]) => void;
    awaitedClick: (waitDuration?: number) => Cypress.Chainable;
    requestsCount: (alias: string) => Cypress.Chainable<number>;
    iframe: (selector: string) => Cypress.Chainable<JQuery<HTMLBodyElement>>;
    saveLocalStorage: (memoryKey?: string) => Cypress.Chainable;
    restoreLocalStorage: (memoryKey?: string) => Cypress.Chainable;
    awaitedScreenshot: (selector: string) => Cypress.Chainable;
  }
}
