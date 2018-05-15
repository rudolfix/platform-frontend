import { expect } from "chai";

import { IAppState } from "../../../store";
import { DeepPartial } from "../../../types";
import { selectIsActionRequiredSettings } from "../selectors";

describe("selectIsActionRequiredSettings", () => {
  it("should return false if KYC data is still loading", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: false,
        businessRequestStateLoading: true,
      },
    };

    const actual = selectIsActionRequiredSettings(appState as any);

    expect(actual).to.be.false;
  });
});
