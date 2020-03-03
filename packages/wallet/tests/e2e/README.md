## E2E tests setup

For e2e tests `detox` and `jest` packages are used. Folow the manual setup guide for IOS and
Android. In case of any errors encountered referer to the `detox`
[troubleshooting](https://github.com/wix/Detox/blob/master/docs/README.md#troubleshooting) docs.

### IOS setup

#### 1. Add [applesimutils](https://github.com/wix/AppleSimulatorUtils)

Install with [homebrew](http://brew.sh/) the latest version of applesimutils used by detox to
communicate with the simulator.

```bash
brew tap wix/brew
brew install applesimutils
```

#### 2. Make sure that the simulator is available on your machine (was installed by Xcode).

List all available devices with `applesimutils --list` and check whether simulator specified in
`./package.json` `detox.configuration["ios.sim.debug"]device.type` is on the list. If it's not
installed you can either change the `device.type` to the one available on your machine or installed
the specified one.

### Android setup

#### 1. Make sure that the emulator is available on your machine (was installed by **AVD Manager**).

Go to AVD Manager and make sure that emulator specified in `./package.json`
`detox.configuration["android.emu.debug/release"]device.avdName` is installed. If it's not installed
you can either change the `device.avdName` to the one available on your machine or installed the
specified one.
