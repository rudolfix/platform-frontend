## Wallet

[![Project dependencies Status](https://david-dm.org/Neufund/platform-frontend/status.svg?path=packages/wallet)](https://david-dm.org/Neufund/platform-frontend?path=packages/wallet)
[![Project devDependencies Status](https://david-dm.org/Neufund/platform-frontend/dev-status.svg?path=packages/wallet)](https://david-dm.org/Neufund/platform-frontend?type=dev&path=packages/wallet)

### Useful links:

## Running project

To run the app locally we need to provide a couple of native dependencies (XCode, AndroidStudio).
Setup differs between platform therefore the best place to follow is
[Setting up the development environment](https://reactnative.dev/docs/environment-setup) guide for
`React Native CLI Quickstart` (sections **Installing dependencies** and **Preparing the Android
device** (just for android development).

Also a proper environment variables should be provided. Create a file at the app root named `.env`
and provide a proper env specific variables (variables in `.env.example` can be used as a default to
run on the `dev` environment).

After environment setup is completed you can start the app in emulator (`yarn start:ios` or
`yarn start:android`).

\_**Note**: For ios before starting the app for the first time and after any changes to the ios
native modules `pod`'s should be installed manually.

```bash
yarn install-pods
```

## Storybook

[Storybook setup](./storybook/README.md)

## Scripts

#### Start the server that communicates with connected devices

```bash
yarn start
```

#### Start app on **ios** emulator

```bash
yarn start:ios

yarn start:ios:release
```

#### Start app on **android** emulator

```bash
yarn start:android

yarn start:android:release

```

#### Start react devtools for component tree debugging

```bash
yarn start:devtools
```

#### Cleaning

Often it's required to clean app artifacts (metro bundler cache, watchman cache, ios build folder /
pods, etc.) to make the app building again. To avoid repeating commands manually two scripts are
available.

To clean automatically and reinstall dependencies use

```bash
yarn clean
```

For a more fine-grained control use manual mode

```bash
yarn clean:manual
```

#### Linting

```bash
yarn format
```

To fix automatically formatting issues use

```bash
yarn format:fix
```

To run typescript compiler in no-emit mode use

```bash
yarn tsc
```

Given that `react-native` uses under the hood babel to compile typescript it won't throw an error on
type mismatch therefore always run `yarn tsc` to force type checking.

#### Run e2e tests on ios or android emulator

Before running e2e tests make sure you have followed [E2E tests setup](./tests/e2e/README.md) guide.

```bash
yarn e2e:ios-debug
yarn e2e:ios-release
yarn e2e:android-debug
yarn e2e:android-release
```

## Releasing

#### Android Debug Release

Apk is signed using `debug` keystore which is committed to repository with cleantext passwords. The
application id is `org.neufund.mobile` (TODO: we should add `.debug` postfix soon)

#### Android Production Release

Android release uses `aab` (bundle) format. In that scheme, the final signing key is maintained by
Google in Play Store and bundle is signed with upload key. The application id is
`org.neufund.mobile`. To generate and sign you should follow the steps.

1. Make sure you have Java JDK and Android build toolchain available with SDK level 28.
2. Valid `.env` file must be present containing valid production configuration (like Firebase
   service access)
3. You need keystore in `wallet/android/app/production.keystore.p12`
4. specify signing config name in `NF_WALLET_ANDROID_RELEASE_SIGCONFIG_NAME`, if missing it defaults
   to `debug`
5. specify signing keys for `production` signing config in `NF_WALLET_ANDROID_RELEASE_KEYSTORE_PASS`
6. build apk (`./gradlew :app:assembleRelease`) or bundle (`./gradlew :app:bundleRelease`). you must
   `cd` to `[..]/wallet/android`
7. verify release build with
   `jarsigner -verify -verbose -certs app/build/outputs/apk/release/app-release.apk`

#### Android Production Keystore Format

Encrypted keystore is committed to repo. We use PKCS12 format. JKS are cryptographically inadequate
and should not be used: https://publik.tuwien.ac.at/files/publik_279118.pdf p. 13. We use randomly
generated 256bit password. To figure out keystore format:

1. make sure keystore is in PKCS12 format with `keytool -list -v -keystore app/production.keystore`

```
Keystore type: jks
Keystore provider: SUN
```

2. convert to keytool -importkeystore -srckeystore app/production.keystore -destkeystore
   app/production.keystore.p12 -srcstoretype JKS -deststoretype PKCS12 -deststorepass [..]
   -destkeypass [same as deststorepass]
3. verify again

```
Keystore type: PKCS12
Keystore provider: SUN
```

4. mind that PKCS12 uses same password for keystore and private keys protection
