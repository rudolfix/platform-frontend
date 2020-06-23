import {
  authModuleAPI,
  EKycRequestStatus,
  EUserType,
  IUser,
  kycApi,
} from "@neufund/shared-modules";
import { ECountries, EthereumAddressWithChecksum } from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { TAppGlobalState } from "../../store";
import { selectIsLightWallet } from "../web3/selectors";
import { EAuthStatus } from "./reducer";

export const selectIsUserEmailVerified = authModuleAPI.selectors.selectIsUserEmailVerified;

export const selectUser = (state: TAppGlobalState): IUser | undefined =>
  authModuleAPI.selectors.selectUser(state);

export const selectAuthStatus = (state: TAppGlobalState): EAuthStatus => state.auth.status;

export const selectIsAuthorized = createSelector(
  authModuleAPI.selectors.selectJwt,
  selectUser,
  selectAuthStatus,
  (jwt, user, status) => !!(jwt && user && status === EAuthStatus.AUTHORIZED),
);

export const selectUserType = createSelector(
  selectUser,
  (user: IUser | undefined): EUserType | undefined => user?.type,
);

export const selectUserEmail = createSelector(
  selectUser,
  (user: IUser | undefined): string | undefined => user?.unverifiedEmail || user?.verifiedEmail,
);

export const selectUnverifiedUserEmail = createSelector(
  selectUser,
  (user: IUser | undefined): string | undefined => user?.unverifiedEmail,
);

export const selectUserId = createSelector(
  selectUser,
  (user: IUser | undefined): EthereumAddressWithChecksum | undefined => user?.userId,
);

export const selectIsThereUnverifiedEmail = (state: TAppGlobalState): boolean =>
  !!selectUnverifiedUserEmail(state);

export const selectDoesEmailExist = (state: TAppGlobalState): boolean =>
  selectIsThereUnverifiedEmail(state) || authModuleAPI.selectors.selectIsUserEmailVerified(state);

export const selectBackupCodesVerified = createSelector(
  selectUser,
  selectIsLightWallet,
  (user: IUser | undefined, isLightWallet: boolean): boolean =>
    user?.backupCodesVerified || !isLightWallet,
);

/**
 * Check if user has verified email and KYC
 */

export const selectIsUserVerified = (state: TAppGlobalState): boolean =>
  selectIsUserEmailVerified(state) &&
  selectBackupCodesVerified(state) &&
  kycApi.selectors.selectKycRequestStatus(state) === EKycRequestStatus.ACCEPTED;

/**
 * Check if user is verified by API and Contract
 */
export const selectIsUserFullyVerified = (state: TAppGlobalState): boolean =>
  selectIsUserVerified(state) && kycApi.selectors.selectIsUserVerifiedOnBlockchain(state);

export const selectIsInvestor = (state: TAppGlobalState): boolean =>
  selectUserType(state) === EUserType.INVESTOR;

export const selectIsUSInvestor = (state: TAppGlobalState): boolean => {
  const isInvestor = selectIsInvestor(state);
  const country = kycApi.selectors.selectClientCountry(state);

  return isInvestor && country === ECountries.UNITED_STATES;
};

/**
 * Investor is restricted when country of residence is blocked for some (often legal) reason
 * TODO: Connect both selectIsRestrictedInvestor and selectIsUsInvestor to single selector returning enum
 */
export const selectIsRestrictedInvestor = createSelector(
  selectIsInvestor,
  kycApi.selectors.selectClientCountry,
  (isInvestor, country) => {
    if (isInvestor && country && process.env.NF_RESTRICTED_INVESTOR_COUNTRIES) {
      const restrictedCountries: string[] = process.env.NF_RESTRICTED_INVESTOR_COUNTRIES.split(
        ",",
      ).map(c => c.trim());

      return restrictedCountries.includes(country);
    }

    return false;
  },
);

export const selectIsIssuer = (state: TAppGlobalState): boolean =>
  selectUserType(state) === EUserType.ISSUER;

export const selectIsVerifiedInvestor = createSelector(
  selectIsInvestor,
  selectIsUserVerified,
  (isInvestor, isUserVerified) => isInvestor && isUserVerified,
);

// TOS Related Selectors

export const selectIsAgreementAccepted = createSelector(
  selectUser,
  (user: IUser | undefined): boolean => !!user?.latestAcceptedTosIpfs,
);
