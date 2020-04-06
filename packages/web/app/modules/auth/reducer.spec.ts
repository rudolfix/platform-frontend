import { EthereumAddressWithChecksum } from "@neufund/shared";
import { expect } from "chai";

import { EUserType } from "../../lib/api/users/interfaces";
import { TAppGlobalState } from "../../store";
import { EWalletSubType, EWalletType } from "../web3/types";
import { EAuthStatus, IAuthState } from "./reducer";
import { selectIsAuthorized, selectUserEmail } from "./selectors";

describe("auth > selectors", () => {
  describe("selectIsAuthorized", () => {
    it("should return true for authorized users", () => {
      const authState: Partial<IAuthState> = {
        user: {
          userId: "user-id" as EthereumAddressWithChecksum,
          type: EUserType.INVESTOR,
          walletType: EWalletType.LIGHT,
          walletSubtype: EWalletSubType.UNKNOWN,
        },
        status: EAuthStatus.AUTHORIZED,
      };

      const jwtState = {
        token: "jwt token",
      };

      const actualValue = selectIsAuthorized({ auth: authState, jwt: jwtState } as TAppGlobalState);

      expect(actualValue).to.be.true;
    });

    it("should return false for not authorized users", () => {
      // this should only happen in the middle of auth process
      const authState: Partial<IAuthState> = {
        user: undefined,
        status: EAuthStatus.NON_AUTHORIZED,
      };

      const jwtState = {
        token: "jwt token",
      };

      const actualValue = selectIsAuthorized({ auth: authState, jwt: jwtState } as TAppGlobalState);

      expect(actualValue).to.be.false;
    });

    it("should return false when jwt token is not present", () => {
      const authState: Partial<IAuthState> = {
        user: {
          userId: "user-id" as EthereumAddressWithChecksum,
          type: EUserType.INVESTOR,
          walletType: EWalletType.LIGHT,
          walletSubtype: EWalletSubType.UNKNOWN,
        },
        status: EAuthStatus.AUTHORIZED,
      };

      const jwtState = {
        token: undefined,
      };

      const actualValue = selectIsAuthorized({ auth: authState, jwt: jwtState } as TAppGlobalState);

      expect(actualValue).to.be.false;
    });
  });

  describe("selectUserEmail", () => {
    it("should prefer unverified user email", () => {
      const state: IAuthState = {
        user: {
          userId: "user-id" as EthereumAddressWithChecksum,
          unverifiedEmail: "unverified@email.com",
          verifiedEmail: "some.verified@email.com",
          type: EUserType.INVESTOR,
          walletType: EWalletType.LIGHT,
          walletSubtype: EWalletSubType.UNKNOWN,
        },
        status: EAuthStatus.AUTHORIZED,
        currentAgreementHash: undefined,
      };

      const actualValue = selectUserEmail(state);

      expect(actualValue).to.be.eq(state.user!.unverifiedEmail);
    });

    it("should return undefined when user is missing", () => {
      const state: IAuthState = {
        user: undefined,
        status: EAuthStatus.NON_AUTHORIZED,
        currentAgreementHash: undefined,
      };

      const actualValue = selectUserEmail(state);

      expect(actualValue).to.be.undefined;
    });
  });
});
