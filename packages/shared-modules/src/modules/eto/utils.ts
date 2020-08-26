import { convertFromUlps, EthereumAddressWithChecksum } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import { includes } from "lodash/fp";

import { EJurisdiction } from "../kyc/module";
import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
  TEtoDataWithCompany,
  TEtoSpecsData,
  TPartialEtoSpecData,
} from "./lib/http/eto-api/EtoApi.interfaces.unsafe";
import {
  calculateCurrentInvestmentProgressPercentage,
  calculateTarget,
} from "./lib/http/eto-api/EtoUtils";
import {
  EEtoStateColor,
  EETOStateOnChain,
  EEtoStateUIName,
  EEtoSubState,
  IEtoTotalInvestment,
  TEtoContractData,
  TEtoStartOfStates,
  TEtoWithCompanyAndContract,
  TEtoWithCompanyAndContractReadonly,
  TEtoWithContract,
} from "./types";

export { canShowDocument } from "./lib/http/eto-api/EtoFileUtils";

export const isPastInvestment = (etoState: EETOStateOnChain) =>
  includes(etoState, [EETOStateOnChain.Payout, EETOStateOnChain.Refund, EETOStateOnChain.Claim]);

export const amendEtoToCompatibleFormat = <T extends TPartialEtoSpecData | TEtoDataWithCompany>(
  eto: T,
): T => ({
  ...eto,
  product: {
    ...eto.product,
    jurisdiction:
      eto.product &&
      eto.product.jurisdiction &&
      (eto.product.jurisdiction.toUpperCase() as EJurisdiction),
  },
});

export const convertToEtoTotalInvestment = (
  [totalEquivEurUlps, totalTokensInt, totalInvestors]: [BigNumber, BigNumber, BigNumber],
  euroTokenBalance: BigNumber,
  etherTokenBalance: BigNumber,
): IEtoTotalInvestment => ({
  totalEquivEur: convertFromUlps(totalEquivEurUlps.toString()).toString(),
  totalTokensInt: totalTokensInt.toString(),
  totalInvestors: totalInvestors.toString(),
  euroTokenBalance: euroTokenBalance.toString(),
  etherTokenBalance: etherTokenBalance.toString(),
});

const convertToDate = (startOf: BigNumber): Date | undefined => {
  if (startOf.isZero()) {
    return undefined;
  }

  return new Date(startOf.mul("1000").toNumber());
};

export const convertToStateStartDate = (startOfStates: BigNumber[]): TEtoStartOfStates => {
  const [
    startOfSetup,
    startOfWhitelist,
    startOfPublic,
    startOfSigning,
    startOfClaim,
    startOfPayout,
    startOfRefund,
  ] = startOfStates.map(convertToDate);

  return {
    [EETOStateOnChain.Setup]: startOfSetup,
    [EETOStateOnChain.Whitelist]: startOfWhitelist,
    [EETOStateOnChain.Public]: startOfPublic,
    [EETOStateOnChain.Signing]: startOfSigning,
    [EETOStateOnChain.Claim]: startOfClaim,
    [EETOStateOnChain.Payout]: startOfPayout,
    [EETOStateOnChain.Refund]: startOfRefund,
  };
};

export function isOnChain<T extends TEtoWithContract>(
  eto: T,
): eto is T & { contract: Exclude<T["contract"], undefined> } {
  return eto.state === EEtoState.ON_CHAIN && eto.contract !== undefined;
}

export const isRestrictedEto = (eto: TEtoWithCompanyAndContractReadonly): boolean =>
  eto.product.jurisdiction === EJurisdiction.GERMANY &&
  !(eto.contract && isPastInvestment(eto.contract.timedState));

/**
 * Check if user is associated with given eto
 * @returns true if user is either the issuer or nominee of the eto
 */
export const isUserAssociatedWithEto = (
  eto: TEtoWithCompanyAndContractReadonly,
  userId: EthereumAddressWithChecksum,
) => eto.companyId === userId || eto.nominee === userId;

type TCalculateSubStateOptions = {
  eto: TEtoSpecsData;
  contract: TEtoContractData | undefined;
  isEligibleToPreEto: boolean;
};

/**
 * Check if eto is still in preparation
 * @returns {boolean} true when ETO is either in PREVIEW or PENDING state
 */
export const isComingSoon = (state: EEtoState): boolean =>
  EEtoState.PREVIEW === state || EEtoState.PENDING === state;

/**
 * Check if eto is active (either presale or public sale)
 */
export const isFundraisingActive = (eto: TEtoWithCompanyAndContractReadonly): boolean => {
  if (isOnChain(eto)) {
    return (
      eto.contract.timedState === EETOStateOnChain.Whitelist ||
      eto.contract.timedState === EETOStateOnChain.Public
    );
  }

  return false;
};

/**
 * Calculates sub state of the ETO
 * Should not be connected with issuer or investor states
 * @todo Remove `isEligibleToPreEto` as it's related to investor
 */
export const getEtoSubState = ({
  eto,
  contract,
  isEligibleToPreEto,
}: TCalculateSubStateOptions): EEtoSubState | undefined => {
  switch (eto.state) {
    /**
     * Sub states 'PREVIEW' can generate
     * - MARKETING_LISTING_IN_REVIEW: after submitting marketing listing to review
     */
    case EEtoState.PREVIEW: {
      if (
        eto.isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING
      ) {
        return EEtoSubState.MARKETING_LISTING_IN_REVIEW;
      }

      return undefined;
    }

    case EEtoState.SUSPENDED:
    case EEtoState.PENDING:
      return undefined;

    case EEtoState.LISTED:
    case EEtoState.PROSPECTUS_APPROVED: {
      if (eto.isBookbuilding) {
        return EEtoSubState.WHITELISTING;
      }

      return EEtoSubState.CAMPAIGNING;
    }
    case EEtoState.ON_CHAIN: {
      if (!contract) {
        throw new Error(`Eto ${eto.etoId} is on chain but without contracts deployed`);
      }

      switch (contract.timedState) {
        case EETOStateOnChain.Setup:
          if (eto.isBookbuilding) {
            return EEtoSubState.WHITELISTING;
          }

          if (!eto.startDate) {
            return EEtoSubState.CAMPAIGNING;
          }

          return isEligibleToPreEto
            ? EEtoSubState.COUNTDOWN_TO_PRESALE
            : EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE;

        case EETOStateOnChain.Whitelist:
          if (!isEligibleToPreEto) {
            return EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE;
          }

          return undefined;
      }

      return undefined;
    }
  }
};
export const getInvestmentCalculatedPercentage = (eto: TEtoWithCompanyAndContractReadonly) => {
  if (isOnChain(eto)) {
    const { totalTokensInt } = eto.contract.totalInvestment;
    const { minimumNewSharesToIssue, equityTokensPerShare } = eto;

    return calculateCurrentInvestmentProgressPercentage(
      totalTokensInt,
      minimumNewSharesToIssue.toString(),
      equityTokensPerShare.toString(),
    );
  }
  return undefined;
};

export const getEtoEurMinTarget = (eto: TEtoWithCompanyAndContractReadonly) => {
  if (
    [
      EEtoState.LISTED,
      EEtoState.PROSPECTUS_APPROVED,
      EEtoState.ON_CHAIN,
      EEtoState.SUSPENDED,
    ].includes(eto.state)
  ) {
    const { minimumNewSharesToIssue, equityTokensPerShare } = eto;

    const totalTokensInt = isOnChain(eto) ? eto.contract.totalInvestment.totalTokensInt : "0";
    const totalEquivEur = isOnChain(eto) ? eto.contract.totalInvestment.totalEquivEur : "0";

    return calculateTarget(
      minimumNewSharesToIssue.toString(),
      equityTokensPerShare.toString(),
      totalTokensInt,
      totalEquivEur,
    );
  }

  return undefined;
};

export const getEtoEurMaxTarget = (eto: TEtoWithCompanyAndContractReadonly) => {
  if (isOnChain(eto)) {
    const { newSharesToIssue, equityTokensPerShare } = eto;
    const { totalTokensInt, totalEquivEur } = eto.contract.totalInvestment;

    return calculateTarget(
      newSharesToIssue.toString(),
      equityTokensPerShare.toString(),
      totalTokensInt,
      totalEquivEur,
    );
  }

  return undefined;
};

export const getEtoNextStateStartDate = (eto: TEtoWithCompanyAndContractReadonly | undefined) => {
  if (eto && isOnChain(eto)) {
    const nextState: EETOStateOnChain | undefined = eto.contract.timedState + 1;

    if (nextState) {
      return eto.contract.startOfStates[nextState];
    }
  }

  return undefined;
};

export const etoIsInOfferState = (onChainState: EETOStateOnChain | undefined) =>
  [
    EETOStateOnChain.Setup,
    EETOStateOnChain.Whitelist,
    EETOStateOnChain.Public,
    EETOStateOnChain.Signing,
  ].some(offerState => offerState === onChainState);

/**
 * Narrows ETO state to the most specific one.
 * For .e.g if ETO is on chain then `eto.contract.timedState` is returned over `eto.state`.
 */
export const getEtoCurrentState = (
  eto: TEtoWithCompanyAndContractReadonly,
): EETOStateOnChain | EEtoState | EEtoSubState => {
  if (eto.subState) {
    return eto.subState;
  } else if (isOnChain(eto)) {
    return eto.contract.timedState;
  } else {
    return eto.state;
  }
};

const stateToColor: Record<EEtoState | EETOStateOnChain | EEtoSubState, EEtoStateColor> = {
  [EEtoState.PREVIEW]: EEtoStateColor.BLUE,
  [EEtoState.PENDING]: EEtoStateColor.ORANGE,
  [EEtoState.LISTED]: EEtoStateColor.BLUE,
  [EEtoState.ON_CHAIN]: EEtoStateColor.GREEN,
  [EEtoState.PROSPECTUS_APPROVED]: EEtoStateColor.GREEN,
  [EEtoState.SUSPENDED]: EEtoStateColor.RED,
  // eto on chain states
  [EETOStateOnChain.Setup]: EEtoStateColor.BLUE,
  [EETOStateOnChain.Whitelist]: EEtoStateColor.GREEN,
  [EETOStateOnChain.Public]: EEtoStateColor.GREEN,
  [EETOStateOnChain.Claim]: EEtoStateColor.GREEN,
  [EETOStateOnChain.Payout]: EEtoStateColor.GREEN,
  [EETOStateOnChain.Refund]: EEtoStateColor.RED,
  [EETOStateOnChain.Signing]: EEtoStateColor.BLUE,

  // eto sub states
  [EEtoSubState.MARKETING_LISTING_IN_REVIEW]: EEtoStateColor.ORANGE,
  [EEtoSubState.CAMPAIGNING]: EEtoStateColor.GREEN,
  [EEtoSubState.WHITELISTING]: EEtoStateColor.GREEN,
  [EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE]: EEtoStateColor.GREEN,
  [EEtoSubState.COUNTDOWN_TO_PRESALE]: EEtoStateColor.GREEN,
};

/**
 * For a given eto returns the proper eto state color
 */
export const getEtoStateColor = (eto: TEtoWithCompanyAndContract) => {
  const state = getEtoCurrentState(eto);

  return stateToColor[state];
};

export const stateToUIName: Record<EEtoState | EETOStateOnChain | EEtoSubState, EEtoStateUIName> = {
  [EEtoState.PREVIEW]: EEtoStateUIName.DRAFT,
  [EEtoState.PENDING]: EEtoStateUIName.PENDING,
  [EEtoState.LISTED]: EEtoStateUIName.CAMPAIGNING,
  [EEtoState.PROSPECTUS_APPROVED]: EEtoStateUIName.CAMPAIGNING,
  [EEtoState.ON_CHAIN]: EEtoStateUIName.ON_CHAIN,
  [EEtoState.SUSPENDED]: EEtoStateUIName.SUSPENDED,

  // on chain state mappings
  [EETOStateOnChain.Setup]: EEtoStateUIName.CAMPAIGNING,
  [EETOStateOnChain.Whitelist]: EEtoStateUIName.PRESALE,
  [EETOStateOnChain.Public]: EEtoStateUIName.PUBLIC_SALE,
  [EETOStateOnChain.Signing]: EEtoStateUIName.IN_SIGNING,
  [EETOStateOnChain.Claim]: EEtoStateUIName.CLAIM,
  [EETOStateOnChain.Payout]: EEtoStateUIName.PAYOUT,
  [EETOStateOnChain.Refund]: EEtoStateUIName.REFUND,

  // on chain sub state mappings
  [EEtoSubState.MARKETING_LISTING_IN_REVIEW]: EEtoStateUIName.PENDING,
  [EEtoSubState.CAMPAIGNING]: EEtoStateUIName.CAMPAIGNING,
  [EEtoSubState.WHITELISTING]: EEtoStateUIName.WHITELISTING,
  [EEtoSubState.COUNTDOWN_TO_PRESALE]: EEtoStateUIName.CAMPAIGNING,
  [EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE]: EEtoStateUIName.CAMPAIGNING,
};

/**
 * Get an UI name for a given eto.
 * @note This is a generic name of a given eto if you need an issuer specific one use `getEtoStateIssuerUIName`.
 */
export const getEtoStateUIName = (eto: TEtoWithCompanyAndContract) => {
  const state = getEtoCurrentState(eto);

  return stateToUIName[state];
};
