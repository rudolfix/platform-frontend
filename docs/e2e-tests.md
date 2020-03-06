# E2E Tests

`Cypress` is used as the main tool for writing e2e tests.

## Writing new tests

You need to have app running locally. Development setup will do.

To open cypress type: `yarn test:e2e:dev`. To write new create file named `feature.spec.e2e.ts`. Tu
run e2e against running frontend do `yarn test:e2e:cypress`.

## Inspecting failed tests on CI

Go to [Cypress Dashboard](https://dashboard.cypress.io/#/projects/y5m5cy/runs) to see failed test
artifacts.

## Test suites

As part of optimizing our CI Pipeline, each PR will need to have test suites assigned, so that in the pipeline we only run relevant tests.

### Tags

All E2E tests are categorized into different tags for example `@p1`, `@kyc` etc. Each tag starts with a `@` and a word that describes the tag. All tags must be separated with a space.

Before submitting a PR the developers and the QA Team will need to discuss and agree on what suites should each PR run. The agreed-upon tags should be added in the description of the Pull request as plain text with space in between each tag, for example, `@p1 @p2`.

#### How do tags work

Danger is used to access githubs API and fetch the github description, the description is parsed and all the tags are taken and added into a file, that will be persisted during the CI run

#### Changing tags

Since tags are taken directly from the Pull Request description, tags can be easily changed. You will only need to edit the description and rerun the CircleCI workflow manually.
