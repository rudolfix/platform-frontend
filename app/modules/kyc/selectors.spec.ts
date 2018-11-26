import { expect } from "chai";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { selectKycRequestStatus } from "./selectors";

describe("selectKycRequestStatus", () => {
  it("should return pending if kyc is approved and on chain claim is false", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: true,
        individualRequestState: { status: "Accepted" },
        businessRequestStateLoading: false,
        claims: { isVerified: false },
      },
      router: {},
    };

    const actual = selectKycRequestStatus(appState as any);

    expect(actual).to.be.equal("Pending");
  });
  it("should return approved if kyc is approved and on chain claim is true", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: true,
        individualRequestState: { status: "Draft" },
        businessRequestStateLoading: false,
        claims: { isVerified: true },
      },
      router: {},
    };

    const actual = selectKycRequestStatus(appState as any);

    expect(actual).to.be.equal("Draft");
  });
  it("should return approved if kyc is approved and on chain claim is true", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: true,
        individualRequestState: { status: "Accepted" },
        businessRequestStateLoading: false,
        claims: { isVerified: false },
      },
      router: {},
    };

    const actual = selectKycRequestStatus(appState as any);

    expect(actual).to.be.equal("Pending");
  });
});
