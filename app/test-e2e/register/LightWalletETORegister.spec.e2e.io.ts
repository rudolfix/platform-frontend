import {
  assertErrorModal,
  assertEtoDashboard,
  goToDashboard,
  logoutViaTopRightButton,
  registerWithLightWalletETO,
} from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Wallet backup e2e recovery phrase", () => {
  const passowrd = "strongpassword";

  it("should register user with light-wallet", () => {
    cy.clearLocalStorage();
    registerWithLightWalletETO("moe-wallet-backup-e2e@test.com", passowrd);

    assertEtoDashboard();
  });

  it("should raise an error that user is already used", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(() => {
      cy.window().then(window => {
        // TODO: move into a seperate util method
        const metaData = JSON.parse(window.localStorage.getItem("NF_WALLET_METADATA") as string);
        goToDashboard();
        logoutViaTopRightButton();
        registerWithLightWalletETO(metaData.email, passowrd, false);

        assertErrorModal();
      });
    });
  });
});
