import { find, findKey } from "lodash/fp";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";

import { EEtoState, TEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { nomineeIgnoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import { nonNullable } from "../../utils/nonNullable";
import { objectToFilteredArray } from "../../utils/objectToFilteredArray";
import { selectUserId } from "../auth/selectors";
import { selectBookbuildingStats } from "../bookbuilding-flow/selectors";
import { selectIsEligibleToPreEto } from "../investor-portfolio/selectors";
import { hiddenJurisdictions } from "./constants";
import { IEtoState } from "./reducer";
import {
  EETOStateOnChain,
  IEtoTokenData,
  TEtoStartOfStates,
  TEtoWithCompanyAndContract,
} from "./types";
import { getEtoSubState } from "./utils";

const selectEtoState = (state: IAppState) => state.eto;

const selectEtoPreviewCode = (state: IAppState, etoId: string) => {
  const eto = find(eto => eto!.etoId === etoId, state.eto.etos);

  if (eto) {
    return eto.previewCode;
  }

  return undefined;
};

export const selectEtoTokenName = (state: IAppState, etoId: string) => {
  const eto = find(eto => eto!.etoId === etoId, state.eto.etos);

  if (eto) {
    return eto.equityTokenName;
  }

  return undefined;
};

export const selectEto = createSelector(
  selectEtoState,
  (_: IAppState, previewCode: string) => previewCode,
  (etoState: DeepReadonly<IEtoState>, previewCode: string) => etoState.etos[previewCode],
);

export const selectCompany = createSelector(
  selectEtoState,
  (_: IAppState, companyId: string) => companyId,
  (etoState: DeepReadonly<IEtoState>, companyId: string) => etoState.companies[companyId],
);

export const selectEtoContract = (state: IAppState, previewCode: string) =>
  state.eto.contracts[previewCode];

export const selectEtoById = (state: IAppState, etoId: string) =>
  state.eto.etos[selectEtoPreviewCode(state, etoId)!];

export const selectEtoSubState = createCachedSelector(
  // forward eto param to combiner
  (_: IAppState, eto: TEtoSpecsData) => eto,
  (state: IAppState, eto: TEtoSpecsData) => selectBookbuildingStats(state, eto.etoId),
  (state: IAppState, eto: TEtoSpecsData) => selectIsEligibleToPreEto(state, eto.etoId),
  (state: IAppState, eto: TEtoSpecsData) => selectEtoContract(state, eto.previewCode),
  (eto, stats, isEligibleToPreEto, contract) =>
    getEtoSubState({ eto, stats, contract, isEligibleToPreEto }),
)((_: IAppState, eto: TEtoSpecsData) => eto.previewCode);

const selectEtoWithCompanyAndContractInternal = createCachedSelector(
  // forward eto param to combiner
  (_: IAppState, eto: TEtoSpecsData) => eto,
  (state: IAppState, eto: TEtoSpecsData) => selectEtoContract(state, eto.previewCode),
  (state: IAppState, eto: TEtoSpecsData) => nonNullable(selectCompany(state, eto.companyId)),
  (state: IAppState, eto: TEtoSpecsData) => selectEtoSubState(state, eto),
  (eto, contract, company, subState) => ({
    ...eto,
    contract,
    company,
    subState,
  }),
)((_: IAppState, eto: TEtoSpecsData) => eto.previewCode);

export const selectEtoWithCompanyAndContract = (
  state: IAppState,
  previewCode: string,
): TEtoWithCompanyAndContract | undefined => {
  const eto = selectEto(state, previewCode);

  if (eto) {
    return selectEtoWithCompanyAndContractInternal(state, eto);
  }

  return undefined;
};

export const selectEtoWithCompanyAndContractById = (
  state: IAppState,
  etoId: string,
): TEtoWithCompanyAndContract | undefined => {
  const previewCode = selectEtoPreviewCode(state, etoId);

  if (previewCode) {
    return selectEtoWithCompanyAndContract(state, previewCode);
  }

  return undefined;
};

export const selectEtos = (state: IAppState): TEtoWithCompanyAndContract[] | undefined => {
  const etoState = selectEtoState(state);

  if (etoState.displayOrder) {
    return etoState.displayOrder
      .map(id => selectEtoWithCompanyAndContract(state, id)!)
      .filter(Boolean);
  }

  return undefined;
};

export const selectEtoOnChainState = (
  state: IAppState,
  previewCode: string,
): EETOStateOnChain | undefined => {
  const contract = state.eto.contracts[previewCode];

  return contract && contract.timedState;
};

export const selectEtoStartOfStates = (
  state: IAppState,
  previewCode: string,
): TEtoStartOfStates | undefined => {
  const contract = state.eto.contracts[previewCode];

  return contract && contract.startOfStates;
};

export const selectEtoOnChainNextStateStartDate = (
  state: IAppState,
  previewCode: string,
): Date | undefined => {
  const eto = selectEtoWithCompanyAndContract(state, previewCode);

  if (eto) {
    const nextState: EETOStateOnChain | undefined = eto.contract!.timedState + 1;

    if (nextState) {
      return eto.contract!.startOfStates[nextState];
    }
  }

  return undefined;
};

export const selectEtoWidgetError = (state: DeepReadonly<IEtoState>): boolean | undefined =>
  state.etoWidgetError;

export const selectEtoOnChainStateById = (
  state: IAppState,
  etoId: string,
): EETOStateOnChain | undefined => {
  const code = selectEtoPreviewCode(state, etoId);

  return code ? selectEtoOnChainState(state, code) : undefined;
};

export const selectTokenData = (
  state: DeepReadonly<IEtoState>,
  previewCode: string,
): IEtoTokenData | undefined => state.tokenData[previewCode];

export const selectIsEtoAnOffer = (state: IAppState, previewCode: string, etoState: EEtoState) => {
  if (etoState !== EEtoState.ON_CHAIN) {
    return true;
  }
  const onChainState = selectEtoOnChainState(state, previewCode);
  return [
    EETOStateOnChain.Setup,
    EETOStateOnChain.Public,
    EETOStateOnChain.Signing,
    EETOStateOnChain.Whitelist,
  ].some(offerState => offerState === onChainState);
};

export const selectFilteredEtosByRestrictedJurisdictions = (
  state: IAppState,
  etos: TEtoData[],
  jurisdiction: string | undefined,
) =>
  jurisdiction
    ? etos.filter(eto => {
        // @See https://github.com/Neufund/platform-frontend/issues/2789#issuecomment-489084892
        const isEtoAnOffer = selectIsEtoAnOffer(state, eto.previewCode, eto.state);
        return (
          !isEtoAnOffer ||
          !(
            hiddenJurisdictions[jurisdiction] &&
            hiddenJurisdictions[jurisdiction].some(
              (hiddenJurisdiction: string) => hiddenJurisdiction === eto.product.jurisdiction,
            )
          )
        );
      })
    : etos;

export const selectNomineeEto = (state: IAppState): TEtoWithCompanyAndContract | undefined => {
  const nomineeId = selectUserId(state);
  const etoState = selectEtoState(state);
  if (nomineeId) {
    const previewCode = findKey(eto => eto!.nominee === nomineeId, etoState.etos);
    return previewCode ? selectEtoWithCompanyAndContract(state, previewCode) : undefined;
  } else {
    throw new Error("linked nominee eto id is invalid");
  }
};

export const selectNomineeEtoState = (state: IAppState) => {
  const eto = selectNomineeEto(state);
  return eto ? eto.state : undefined;
};

export const selectNomineeEtoTemplatesArray = (state: IAppState): IEtoDocument[] => {
  const eto = selectNomineeEto(state);
  const filterFunction = (key: string) =>
    !nomineeIgnoredTemplates.some((templateKey: string) => templateKey === key);

  return eto !== undefined ? objectToFilteredArray(filterFunction, eto.templates) : [];
};
