import { tid } from "@neufund/shared/tests";
import { expect } from "chai";
import { shallow } from "enzyme";
import noop from "lodash/noop";
import * as React from "react";

import { getMessageTranslation, LedgerErrorMessage } from "../../../../translatedMessages/messages";
import { createMessage } from "../../../../translatedMessages/utils";
import { WalletLedgerInit } from "./WalletLedgerInit";

describe("<WalletLedgerInitComponent />", () => {
  it("should render error message", () => {
    const errorMsg = createMessage(LedgerErrorMessage.GENERIC_ERROR);
    const expectedResult = getMessageTranslation(errorMsg);
    const component = shallow(
      <WalletLedgerInit
        errorMessage={errorMsg}
        isInitialConnectionInProgress={false}
        tryToEstablishConnectionWithLedger={noop}
      />,
    );

    expect(
      component
        .find(tid("ledger-wallet-error-msg"))
        .children()
        .get(0),
    ).to.be.deep.eq(expectedResult);
  });
});
