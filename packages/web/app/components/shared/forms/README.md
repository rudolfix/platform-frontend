Contains reusable form controls.

##### Directory structure

_Note: we are in a migration process so not all parts are migrated yet._

- **fields** - Formik connected controls build on top of components provided by `layouts` folder.

- **bare-fields** - Form controls (not connected to the formik) build on top of components provided
  by `layouts` folder. Bare fields should be avoided whenever possible and formik connected
  **fields** should be used instead.

- **layouts** - Reusable bare form control components that are not connected to any provider (for
  e.g formik).
