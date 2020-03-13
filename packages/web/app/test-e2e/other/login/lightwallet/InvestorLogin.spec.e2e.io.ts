import { appRoutes } from "../../../../components/appRoutes";
import { stubChallengeApiRequest } from "../../../utils/apiStubs";
import {
  assertDashboard,
  assertVerifyEmailWidgetIsInVerfiedEmailState,
  assertWaitForLatestEmailSentWithSalt,
  createAndLoginNewUser,
  generateRandomEmailAddress,
  getLatestVerifyUserEmailLink,
  goToDashboard,
  goToProfile,
  lightWalletTypeRegistrationInfo,
  loginWithLightWallet,
  logoutViaAccountMenu,
  registerWithLightWallet,
  tid,
  verifyLatestUserEmailAccountSetup,
} from "../../../utils/index";

describe("Investor", () => {
  let email: string;
  let password: string;

  beforeEach(() => {
    cy.clearLocalStorage();

    email = generateRandomEmailAddress();
    password = "strongpassword";
  });

  it("should not register without accepting Terms of Use", () => {
    cy.visit(appRoutes.register);

    cy.get(tid("wallet-selector-register-email"))
      .type("{selectall}{backspace}")
      .type(email);
    cy.get(tid("wallet-selector-register-password")).type(password);
    cy.get(tid("wallet-selector-register-confirm-password")).type(password);

    cy.get(tid("wallet-selector-register-button")).should("be.disabled");
  });

  it("should register user with light-wallet and send email #login #p1", () => {
    registerWithLightWallet(email, password);

    assertWaitForLatestEmailSentWithSalt(email);
  });

  it("should show network error #login #p2", () => {
    cy.server();
    stubChallengeApiRequest({}, 400);
    cy.visit(appRoutes.register);
    lightWalletTypeRegistrationInfo(email, password);
    cy.get(tid("generic-modal-dismiss-button")).click();

    // Should be able to register again once we hit an error

    lightWalletTypeRegistrationInfo(email, password);
    cy.get(tid("generic-modal-dismiss-button")).click();
  });

  it("should remember light wallet details after logout #login #p2", () => {
    registerWithLightWallet(email, password);

    logoutViaAccountMenu();

    loginWithLightWallet(email, password);

    assertDashboard();
  });

  it("should recognize ETO user and save metadata correctly #login #p2", () => {
    // todo: we should let to register as issuer here so mock is not needed
    registerWithLightWallet(email, password);

    logoutViaAccountMenu();

    loginWithLightWallet(email, password);

    assertDashboard().then(() => {
      const savedMetadata = (window.localStorage as any).NF_WALLET_METADATA;
      cy.clearLocalStorage().then(() => {
        // mock issuer metadata
        const mockedMetadata = JSON.parse(savedMetadata);
        mockedMetadata.userType = "issuer";
        (window.localStorage as any).NF_WALLET_METADATA = JSON.stringify(mockedMetadata);

        cy.visit("eto/login/light");
        // investor metadata woud be cleared here
        cy.contains(tid("light-wallet-login-with-email-email-field"), email);
        cy.get(tid("light-wallet-login-with-email-password-field")).type(password);
        cy.get(tid("wallet-selector-nuewallet.login-button")).awaitedClick();

        assertDashboard().then(() => {
          //after login investor metadata are again saved into local storage
          expect((window.localStorage as any).NF_WALLET_METADATA).to.be.deep.eq(savedMetadata);
        });
      });
    });
  });

  it("should wipe out saved investor wallet when issuer login #login #p3", () => {
    // todo: we should let to register as issuer here so mock is not needed
    registerWithLightWallet(email, password);

    logoutViaAccountMenu();

    loginWithLightWallet(email, password);

    assertDashboard().then(() => {
      cy.clearLocalStorage().then(() => {
        cy.visit("eto/login/light");
        // investor metadata woud be cleared here
        expect((window.localStorage as any).NF_WALLET_METADATA).to.not.exist;
      });
    });
  });

  it("should return an error when logging with same email #login #p3", () => {
    // register once and then verify email account
    cy.visit("/register");
    lightWalletTypeRegistrationInfo(email, password);
    assertDashboard();
    verifyLatestUserEmailAccountSetup(email);
    logoutViaAccountMenu();
    cy.clearLocalStorage();

    // register again with the same email, this should show a warning
    cy.visit("/register");
    lightWalletTypeRegistrationInfo(email, password);
    cy.get(tid("email-error")).contains("Sorry. This email address is already in use");
    cy.get(tid("wallet-selector-register-button")).should("be.disabled");
  });

  it("should update login email on activation #login #p2", () => {
    const TEST_LINK =
      "https://localhost:9090/email-verify?code=b7fb21ea-b248-4bc3-8500-b3f2b8644c17&email=pavloblack%40hotmail.com&user_type=investor&wallet_type=light&wallet_subtype=unknown&salt=XzNJFpdkgjOxrUXPFD6NmzkUGGpUmuA5vjrt1xyMFd4%3D";

    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();

      logoutViaAccountMenu();

      goToDashboard(false);

      cy.get(tid("light-wallet-login-with-email-email-field")).then(registerEmailNode => {
        const registerEmail = registerEmailNode.text();
        cy.log("Email used for registering:", registerEmail);
        // Use activation link
        cy.visit(TEST_LINK);
        cy.get(tid("light-wallet-login-with-email-email-field")).then(activationEmailNode => {
          const activationEmail = activationEmailNode.text();
          expect(activationEmail).to.not.equal(registerEmail);
        });
      });
    });
  });

  it("should logout previous user when email activation occurs #login #p3", () => {
    registerWithLightWallet(email, password);
    assertDashboard();

    getLatestVerifyUserEmailLink(email).then(activationLink => {
      logoutViaAccountMenu();

      // register another user
      const newEmail = generateRandomEmailAddress();
      registerWithLightWallet(newEmail, password);

      assertDashboard();

      // try to activate previous user when second one is logged in
      cy.visit(activationLink);

      // Asserts if error toast shows up
      // @SEE https://github.com/Neufund/platform-frontend/issues/2709
      cy.get(tid("modules.auth.sagas.verify-user-email.toast.verification-failed")).should("exist");

      cy.get(tid("light-wallet-login-with-email-email-field")).contains(email);
      cy.get(tid("light-wallet-login-with-email-password-field")).type(password);
      cy.get(tid("wallet-selector-nuewallet.login-button")).click();

      assertDashboard();
      goToProfile();
      // email should be verified
      assertVerifyEmailWidgetIsInVerfiedEmailState();
      cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
    });
  });
});
