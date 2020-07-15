import {
  authModuleAPI,
  EETOStateOnChain,
  etoModuleApi,
  EUserType,
  TEtoInvestmentCalculatedValues,
} from "@neufund/shared-modules";
import { DataUnavailableError } from "@neufund/shared-utils";

import { TAppGlobalState } from "../../store";
import { selectIssuerEto, selectIssuerEtoWithCompanyAndContract } from "../eto-flow/selectors";
import { selectActiveNomineeEto } from "../nominee-flow/selectors";

export const selectEtoWithCompanyAndContract = (state: TAppGlobalState, previewCode?: string) => {
  const userType = authModuleAPI.selectors.selectUserType(state);
  switch (userType) {
    case EUserType.NOMINEE:
      return selectActiveNomineeEto(state);
    case EUserType.ISSUER:
      if (previewCode !== undefined) {
        return etoModuleApi.selectors.selectInvestorEtoWithCompanyAndContract(state, previewCode);
      } else {
        return selectIssuerEtoWithCompanyAndContract(state);
      }
    case EUserType.INVESTOR:
    default:
      if (previewCode === undefined) {
        throw new DataUnavailableError("preview code missing");
      }
      return etoModuleApi.selectors.selectInvestorEtoWithCompanyAndContract(state, previewCode);
  }
};

export const selectIssuerEtoInvestmentCalculatedValues = (
  state: TAppGlobalState,
): TEtoInvestmentCalculatedValues | undefined => {
  const eto = selectIssuerEto(state);
  return eto && eto.investmentCalculatedValues;
};

export const selectStartOfOnchainState = (
  state: TAppGlobalState,
  previewCode: string,
  onChainState: EETOStateOnChain,
) => {
  const eto = selectEtoWithCompanyAndContract(state, previewCode);

  const startOfStates = eto && eto.contract && eto.contract.startOfStates;

  return startOfStates && startOfStates[onChainState];
};
