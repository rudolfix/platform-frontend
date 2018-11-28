import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { LedgerErrorMessage } from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { WalletLedgerInitComponent } from "./WalletLedgerInitComponent";

describe("<WalletLedgerInitComponent />", () => {
  it("should render error message", () => {
    const errorMsg = createMessage(LedgerErrorMessage.GENERIC_ERROR);
    const component = shallow(
      <WalletLedgerInitComponent
        errorMessage={errorMsg}
        isInitialConnectionInProgress={false}
        intl={dummyIntl}
      />,
    );
    expect(component.find(tid("ledger-wallet-error-msg")).text()).to.be.eq(errorMsg);
  });
});
