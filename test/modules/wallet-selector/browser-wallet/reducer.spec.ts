import { expect } from "chai";
import { actions } from "../../../../app/modules/actions";
import { browserWalletWizardReducer } from "../../../../app/modules/wallet-selector/browser-wizard/reducer";

describe("Wallet selector > Ledger wizard > reducer", () => {
  it("should act on BROWSER_WALLET_CONNECTION_ERROR action", () => {
    const expectedErrorMsg = "some error";

    const actualState = browserWalletWizardReducer(
      undefined,
      actions.wallet.browserWalletConnectionError(expectedErrorMsg),
    );

    expect(actualState).to.be.deep.eq({ isLoading: false, errorMsg: expectedErrorMsg });
  });
});
