import { DeepPartial } from "@neufund/shared-utils";
import { expect } from "chai";

import { EUserType } from "../auth/module";
import { EKycRequestStatus } from "./lib/http/kyc-api/KycApi.interfaces";
import { TKycModuleState } from "./module";
import { selectKycRequestStatus } from "./selectors";

describe("selectKycRequestStatus", () => {
  const authState = {
    auth: {
      user: {
        type: EUserType.INVESTOR,
      },
    },
  };

  it("should return pending if kyc is approved and on chain claim is false", () => {
    const appState: DeepPartial<TKycModuleState> = {
      kyc: {
        statusLoading: true,
        status: { status: EKycRequestStatus.ACCEPTED },
        claims: { isVerified: false },
      },
    };

    const actual = selectKycRequestStatus({ ...appState, auth: authState } as any);

    expect(actual).to.be.equal(EKycRequestStatus.PENDING);
  });
  it("should return approved if kyc is approved and on chain claim is true", () => {
    const appState: DeepPartial<TKycModuleState> = {
      kyc: {
        statusLoading: true,
        status: { status: EKycRequestStatus.DRAFT },
        claims: { isVerified: true },
      },
    };

    const actual = selectKycRequestStatus({ ...appState, auth: authState } as any);

    expect(actual).to.be.equal(EKycRequestStatus.DRAFT);
  });
  it("should return approved if kyc is approved and on chain claim is true", () => {
    const appState: DeepPartial<TKycModuleState> = {
      kyc: {
        statusLoading: true,
        status: { status: EKycRequestStatus.ACCEPTED },
        claims: { isVerified: false },
      },
    };

    const actual = selectKycRequestStatus({ ...appState, auth: authState } as any);

    expect(actual).to.be.equal(EKycRequestStatus.PENDING);
  });
});
