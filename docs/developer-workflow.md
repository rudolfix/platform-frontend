# Developer Workflow [internal]

### 1. Create branch for the feature/issue/task

###### Board status: In Progress

Branch name convention is `{username}/{issueid}-{short-description}`

Typically the branch must be created off of "master". For hotfix PRs, create it off of "production" and include "hotfix" in the branch name.

### 2. Code

- If you're adding a snippet borrowed from elsewhere (Github/Stackoverflow etc), add a comment with the link to the source. It could be useful to read more about the issue that warranted the solution/fix and also the source may have new updated the code.
- See [Component development guidelines](https://github.com/Neufund/platform-frontend/blob/master/docs/component-development-guidelines.md)
- See [React guidelines](https://github.com/Neufund/platform-frontend/blob/master/docs/react-guidelines.md)
- See [Working with Intl](https://github.com/Neufund/platform-frontend/blob/master/docs/working-with-Intl.md)

#### Acceptability criteria for a PR:<br/>

- UI components must be accompanied by stories (Atoms/Molecules/Organisms but not Pages/Connected Components)

##### Tests
- for utils, add unit tests
- anything that modifies a user flow must be accompanied by E2E tests (the happy path, error handling path and any edge cases)
- for a test to be considered non-flaky it must pass at least 3 times in a row.

##### Adding Types
- type any sagas your PR touches. See [Saga Migration Plan](https://github.com/Neufund/platform-frontend/blob/master/docs/saga-migration-guidelines.md)
- files named `.unsafe.tsx` may already contain types but they must be fully typed (including replacing type `any` with an appropriate type)

#### Documentation

As for now, we don't have any strict guidelines for documentation.
It's up for a developer to decide when to document a given part of the system of but we are trying to follow points mentioned below:
- If the function is pretty complex first of all try to split it by smaller parts more focus parts. If that's not possible add `tsdoc` comment with a short (but comprehensive) explanation
- If you need to do something unusual (for .e.g. force cast type) add a short explanation above that line
- When adding a new package, add a README explaing what the package is about and other helpful information
- When you add a new module (saga + reducer + selector + types + spec), add documentation explaining the module 
- Add `tsdoc` comments for any utils you add or modify

### 3. Create a PR

For WIP PRs, you can use a draft PR or mark it as "[WIP]". Using Zenhub, link the PR to the corresponding issue (if exists). Also add any special issues or remarks you may have.

### 4. Dev Review

###### Board status: Review

Once done, request for dev review in the front end channel on Slack. We require at least one approval from the dev to push PR to the **QA Review**.

In case a PR involves dependency updates or if it introduces changes other devs need to be aware of (for .e.g. React update which introduces hooks) then request approval from all devs. The PR should contain external links to changelogs if there are any. Such kind of a PR must be marked with `[All devs approval required]` in the title. The idea behind this is that all devs are informed of the changes. The first dev reviewing it should must also review the code in detail. For everyone else, it's optional.

For this:
- the branch has to be brought up to date with master.
- run `yarn lint:fix` to update the artifacts as well as prettify the code
- All checks must have passed

Note: There maybe instances where unrelated tests are failing either because they are flaky or due to an issue with the pipeline itself.

Keep an eye out for change in:
- Build size
- Type coverage
- Visual regression
- Full visual regression

### 5. QA Review

###### Board status: QA

This step can be skipped if it's a purely technical task and does not change the behavior of the application e.g. upgrading dependencies, refactor etc. Mark such PRs with a `Tech` label.

### 6. Merge

###### Board status: Staging

Once reviewed by QA, merge the PR. If it needs more work, move it back to In Progress on the board.
In most cases (PRs to master) do a squash merge (unless you have to keep your commits in which case make sure the commits are clean). For release PRs (master to production), do a default merge.

Merge commit format convention:

`(#${issue-number}) {message}`

Note: You don't have to link to the PR as Github already does it.


### 7. Closed

###### Board status: Closed

The ticket is only closed once its released on production. And it will be closed by QA. Developers don't touch the ticket after it goes from review to QA.
Except for "Tech" tickets which should be pushed directly to staging.

## PR Labels

| Label | Description                          |
|-------|--------------------------------------|
| TECH  | PRs that don't have to go through QA |
| E2E   | PRs that only modify e2e tests       | 
| QA    | PRs that are ready for QA            | 
