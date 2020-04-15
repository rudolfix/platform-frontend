`patches` folder contains fixes created by [`patch-package`](https://www.npmjs.com/package/patch-package) library.

Patching a package should be avoided and used as a last resort with approval from the whole team.

The following library patches can be found here:

### Formik

Formik `2.*` at the moment has a bug where not all values from `Formik` config are forwarded to the `FormikProvider`. As the end result the logic related to showing whether field is required or optional is not working properly.

[#2090](https://github.com/jaredpalmer/formik/pull/2090) PR was created to fix the bug but it was not yet merged. After the PR mentioned above is merged we can safely delete the patch (we do have e2e test covering the bug)

Also please note that for formik we need to patch two files with the same changes:

- `formik.cjs.development` a commonjs export used by unit tests
- `formik.esm.js` an es modules export used by app

### bitcore-mnemonic

At the moment bitcore-mnemonic includes BIP39 mnemonics for [a couple of languages](https://github.com/bitpay/bitcore/blob/master/packages/bitcore-mnemonic/lib/words/index.js) by default. This in turn hugely impacts the app final bundle size.

To reduce the bundle size the patch was applied to only export English language mnemonics.

### bignumber.js

Bignumber typings were changed and number types were removed from almost all methods that use BigNumbers. Currently you can only use BigNumbers with `strings` or other `BigNumber` instances.

This will eliminate some problems we have with initilializing BigNumbers with floating point Numbers errors.
