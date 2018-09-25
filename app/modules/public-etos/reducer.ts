import {
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { ICalculatedContribution, IEtoContractData } from "./types";

export interface IPublicEtoState {
  // only preview, endpoint eto-listing/eto-previews
  previewEtoData?: TPartialEtoSpecData;
  previewCompanyData?: TPartialCompanyEtoData;

  // for endpoint eto-listing/etos
  publicEtos: { [etoId: string]: TPublicEtoData | undefined };
  calculatedContributions: { [etoId: string]: ICalculatedContribution };
  contracts: { [etoId: string]: IEtoContractData };
  displayOrder: string[];
}

export const etoFlowInitialState: IPublicEtoState = {
  publicEtos: {},
  calculatedContributions: {},
  contracts: {},
  displayOrder: [],
};

export const publicEtosReducer: AppReducer<IPublicEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IPublicEtoState> => {
  switch (action.type) {
    case "PUBLIC_ETOS_SET_PUBLIC_ETOS":
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          ...action.payload.etos,
        },
      };
    case "PUBLIC_ETOS_SET_PUBLIC_ETO":
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          [action.payload.eto.etoId]: action.payload.eto,
        },
      };
    case "PUBLIC_ETOS_SET_DISPLAY_ORDER":
      return {
        ...state,
        displayOrder: action.payload.order,
      };
    case "PUBLIC_ETOS_SET_CALCULATED_CONTRIBUTION":
      return {
        ...state,
        calculatedContributions: {
          ...state.calculatedContributions,
          [action.payload.etoId]: action.payload.contrib,
        },
      };
    case "PUBLIC_ETOS_SET_ETO_DATA_FROM_CONTRACT":
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.etoId]: action.payload.data,
        },
      };
    case "PUBLIC_ETOS_SET_PREVIEW_ETO":
      const data = action.payload.data;
      return {
        ...state,
        previewEtoData: data && data.eto,
        previewCompanyData: data && data.company,
      };
  }

  return state;
};
