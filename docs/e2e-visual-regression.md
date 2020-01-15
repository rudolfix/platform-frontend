**Writing new visual regression tests**

All visual regression tests should have *.spec.e2e.visreg.ts* extension in order to be run in vis-reg scope. 

To perform screenshot you have to invoke 
`cy.screenshot();` or `cy.awaitedScreenshot(selector: string);`. Built-in method will make a screenshot as-is, while *awaitedScreenshot* will ensure that specified selector is accessible before taking a screenshot.


**Screenshot configuration**

Default screenshot configuration is stored in [commands.js](../packages/web/cypress/support/commands.js) file.
`onBeforeScreenshot` and `onAfterScreenshot` methods are responsible for preparing page before taking screenshot and restore it after doing it, for example making all fixed elements static. 

To blackout element you have to add specified selector into the `blackout` array. It will help to exclude false positives from vis-reg like timers or money values.

**Vis reg**

Our vis reg process utilizes [codechecks.io](https://codechecks.io) and [reg-suit](https://reg-viz.github.io/reg-suit/) package.

Config file [regconfig_e2e.json](../packages/web/regconfig_e2e.json)

Vis reg script [codechecks-e2e-vis-reg.ts](./packages/web/codechecks-e2e-vis-reg.ts)

*Plugins*
- `reg-simple-keygen-plugin` - plugin to determine the snapshot key with given values, allows reg-suit to compare HEAD of the master branch with the PR's commit.

