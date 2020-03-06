// This workaround brings the desired behaviour of running automation tests which marked with specific
// tags back from mocha.js .
//
// The immediately invoked function expression will overwrite the it function of Cypress
// if tags are provided in Cypress.env("Tags").
//
// cypress run --env Tags=#p1&#wallet
// will run all tests BUT
// the tests without the #p1 and #wallet tags will be skipped (the other ones with that tag will run usual way)
//
// NB: The tests which are skipped will be marked as Pending in Cypress run
// The issue/workaround: https://github.com/cypress-io/cypress/issues/1865#issuecomment-585185300
(function() {
  if (!Cypress.env("Tags")) {
    return;
  }
  const tags = Cypress.env("Tags").replace("&", " ");
  let orgIt = it;
  let filterFunction = function(title, fn) {
    const splitTitle = title.split(" ");
    if (!splitTitle.some(t => tags.indexOf(t) !== -1)) {
      fn = null;
    }
    orgIt(title, fn);
  };
  let filteredIt = filterFunction;
  filteredIt.skip = orgIt.skip;
  filteredIt.only = orgIt.only;
  filteredIt.retries = orgIt.retries;
  it = filteredIt;
})();
