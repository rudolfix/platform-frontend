enum EAppRoutes {
  // unauthorized routes
  landing = "Landing",
  importAccount = "ImportAccount",
  noBiometrics = "NoBiometrics",
  unlockAccount = "UnlockAccount",
  importFixture = "ImportFixtureAccount",
  walletConnectSession = "WalletConnectSession",

  // authorized routes
  home = "Home",
  portfolio = "Portfolio",
  wallet = "Wallet",
  profile = "Profile",
  qrCode = "QRCode",
  webView = "WebView",
  switchToFixture = "SwitchToFixture",
  accountBackup = "AccountBackup",
}

export { EAppRoutes };
