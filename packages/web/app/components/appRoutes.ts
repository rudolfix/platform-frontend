export const appRoutes = {
  // ----- HARDCODED TEMP ROUTES ---//
  greyp: "/greyp",
  greypWithJurisdiction: "/:jurisdiction/greyp",
  //--------------------------------//

  verify: "/email-verify",
  icbmMigration: "/migrate",
  walletUnlock: "/wallet-unlock-etherlock",

  root: "/",

  register: "/register",
  registerWithLightWallet: "/register/light",
  registerWithBrowserWallet: "/register/browser",
  registerWithLedger: "/register/ledger",

  registerIssuer: "/eto/register",
  registerIssuerWithLightWallet: "/eto/register/light",
  registerIssuerWithBrowserWallet: "/eto/register/browser",
  registerIssuerWithLedger: "/eto/register/ledger",

  registerNominee: "/nominee/register",
  registerNomineeWithLightWallet: "/nominee/register/light",
  registerNomineeWithBrowserWallet: "/nominee/register/browser",
  registerNomineeWithLedger: "/nominee/register/ledger",

  login: "/login",
  loginBrowserWallet: "/login/browser",
  walletconnect: "/wc",

  restore: "/restore",

  etoIssuerView: "/eto/view",
  etoIssuerViewStats: "/eto/view/stats",

  etoPublicView: "/eto/view/:jurisdiction/:previewCode",
  etoPublicViewById: "/eto/by-id/:jurisdiction/:etoId",

  etoWidgetView: "/embed/eto/widget/:previewCode",

  kyc: "/kyc",
  wallet: "/wallet",
  dashboard: "/dashboard",
  documents: "/documents",
  profile: "/profile",
  demo: "/demo",
  eto: "/eto",

  etoRegister: "/eto/registration",

  portfolio: "/portfolio",

  unsubscription: "/unsubscription/:email",
  unsubscriptionSuccess: "/unsubscription/success",

  /*
   * the following routes shouldn't be used in the code,
   * they are only there to catch accidental user input
   * or for backward compatibility
   */

  /*
   * @deprecated
   * */
  etoLanding: "/eto-landing",

  /*
   * @deprecated
   * */
  loginIssuer: "/eto/login",
  /*
   * @deprecated
   * */
  loginNominee: "/nominee/login",
  /*
  @deprecated
   */
  restoreIssuer: "/eto/restore",
  /*
   * @deprecated
   * */
  restoreNominee: "/nominee/restore",
  /*
   * @deprecated Route with eto jurisdiction should be used instead. This is only for backward compatibility.
   */
  etoPublicViewByIdLegacyRoute: "/eto/by-id/:etoId",
  /*
   * @deprecated Route with eto jurisdiction should be used instead. This is only for backward compatibility.
   */
  etoPublicViewLegacyRoute: "/eto/view/:previewCode",
};
