import { expect } from "chai";
import { browserWalletConnectionErrorAction } from "../../../../app/modules/wallet-selector/browser-wizard/actions";
import { browserWalletWizardReducer } from "../../../../app/modules/wallet-selector/browser-wizard/reducer";

describe("Wallet selector > Ledger wizard > reducer", () => {
  it("should act on BROWSER_WALLET_CONNECTION_ERROR action", () => {
    const expectedErrorMsg = "some error";

    const actualState = browserWalletWizardReducer(
      undefined,
      browserWalletConnectionErrorAction({ errorMsg: expectedErrorMsg }),
    );

    expect(actualState).to.be.deep.eq({ isLoading: false, errorMsg: expectedErrorMsg });
  });
});
