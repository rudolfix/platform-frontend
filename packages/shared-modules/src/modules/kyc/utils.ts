import BigNumber from "bignumber.js";
import { filter, findIndex, isNil, omitBy } from "lodash";

import { createMessage, TMessage } from "../../messages";
import {
  EKycRequestStatus,
  IKycBeneficialOwner,
  IKYCBeneficialOwnerBusiness,
  IKYCBeneficialOwnerPerson,
  KycBeneficialOwnerBusinessSchema,
  KycBeneficialOwnerPersonSchema,
} from "./lib/http/kyc-api/KycApi.interfaces";
import { EKycRequestStatusTranslation } from "./messages";
import { EBeneficialOwnerType, TClaims } from "./types";

export function deserializeClaims(claims: string): TClaims {
  const claimsN = new BigNumber(claims, 16);

  const isVerified = claimsN.mod("2").eq("1");
  const isSophisticatedInvestor = claimsN
    .dividedToIntegerBy("2")
    .mod(2)
    .eq("1");

  const hasBankAccount = claimsN
    .dividedToIntegerBy("4")
    .mod(2)
    .eq("1");

  const isAccountFrozen = claimsN
    .dividedToIntegerBy("8")
    .mod(2)
    .eq("1");

  return {
    isVerified,
    isSophisticatedInvestor,
    hasBankAccount,
    isAccountFrozen,
  };
}

export const kycStatusToTranslationMessage = (status: EKycRequestStatus): TMessage => {
  switch (status) {
    case EKycRequestStatus.REJECTED:
      return createMessage(EKycRequestStatusTranslation.REJECTED);
    case EKycRequestStatus.ACCEPTED:
      return createMessage(EKycRequestStatusTranslation.ACCEPTED);
    case EKycRequestStatus.DRAFT:
      return createMessage(EKycRequestStatusTranslation.DRAFT);
    case EKycRequestStatus.IGNORED:
      return createMessage(EKycRequestStatusTranslation.IGNORED);
    case EKycRequestStatus.OUTSOURCED:
      return createMessage(EKycRequestStatusTranslation.OUTSOURCED);
    case EKycRequestStatus.PENDING:
      return createMessage(EKycRequestStatusTranslation.PENDING);
  }
};

export function appendIfExists<T>(array: ReadonlyArray<T>, item: T | undefined): ReadonlyArray<T> {
  if (!array) array = [];
  if (item) return [...array, item];
  return array;
}

/**
 * Used to update BeneficialOwners array
 */
export function updateArrayItem(
  array: ReadonlyArray<IKycBeneficialOwner>,
  id?: string,
  item?: IKycBeneficialOwner,
): ReadonlyArray<IKycBeneficialOwner> {
  if (!id) return array; // no changes
  if (id && !item) return filter(array, (i: IKycBeneficialOwner) => getBeneficialOwnerId(i) !== id); // delete item
  if (id && item) {
    const index = findIndex(array, (i: IKycBeneficialOwner) => getBeneficialOwnerId(i) === id);
    if (index === -1) return [...array, item]; // append

    return [...array.slice(0, index), item, ...array.slice(index + 1)];
  }
  return array;
}

export function omitUndefined<T>(obj: T): { [P in keyof T]?: T[P] } {
  return omitBy(obj, isNil) as any;
}

/**
 * Used to manage a counter that represents say files currently being uploaded
 */
export const conditionalCounter = (condition: boolean, value: number): number =>
  condition ? value + 1 : value - 1;

/**
 * Extract id from BeneficiaryOwner object
 */
export const getBeneficialOwnerId = (owner: IKycBeneficialOwner): string =>
  ((owner.business as IKYCBeneficialOwnerBusiness) || (owner.person as IKYCBeneficialOwnerPerson))
    .id;

/**
 * Extract type from BeneficiaryOwner object
 */
export const getBeneficialOwnerType = (owner: IKycBeneficialOwner): EBeneficialOwnerType =>
  owner.person ? EBeneficialOwnerType.PERSON : EBeneficialOwnerType.BUSINESS;

/**
 * Extract country value from BeneficiaryOwner object
 */
export const getBeneficialOwnerCountry = (owner: IKycBeneficialOwner): string | undefined => {
  if (!owner) {
    return undefined;
  }

  const details = owner[EBeneficialOwnerType.BUSINESS] || owner[EBeneficialOwnerType.PERSON];
  return details ? details.country : undefined;
};

/**
 * Validates BeneficiaryOwner based on type
 */
export const validateBeneficiaryOwner = (
  type: EBeneficialOwnerType,
  owner: IKycBeneficialOwner | undefined,
): boolean => {
  if (!owner) {
    return false;
  }

  if (type === EBeneficialOwnerType.PERSON) {
    return KycBeneficialOwnerPersonSchema.isValidSync(owner.person);
  }

  return KycBeneficialOwnerBusinessSchema.isValidSync(owner.business);
};
