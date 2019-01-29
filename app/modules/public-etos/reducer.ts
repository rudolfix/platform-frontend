import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { IEtoContractData } from "./types";

export interface IPublicEtoState {
  publicEtos: { [previewCode: string]: TEtoSpecsData | undefined };
  companies: { [companyId: string]: TCompanyEtoData | undefined };
  contracts: { [previewCode: string]: IEtoContractData };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
}

export const etoFlowInitialState: IPublicEtoState = {
  publicEtos: {},
  companies: {},
  contracts: {},
  displayOrder: undefined,
  maxCapExceeded: {},
  etoWidgetError: undefined,
};

export const publicEtosReducer: AppReducer<IPublicEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IPublicEtoState> => {
  switch (action.type) {
    case actions.publicEtos.setPublicEtos.getType():
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          ...action.payload.etos,
        },
        companies: {
          ...state.companies,
          ...action.payload.companies,
        },
      };
    case actions.publicEtos.setPublicEto.getType():
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          [action.payload.eto.previewCode]: action.payload.eto,
        },
        companies: {
          ...state.companies,
          [action.payload.company.companyId]: action.payload.company,
        },
      };
    case actions.publicEtos.setEtosDisplayOrder.getType():
      return {
        ...state,
        displayOrder: action.payload.order,
      };
    case actions.publicEtos.setEtoDataFromContract.getType():
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.previewCode]: action.payload.data,
        },
      };
    case actions.publicEtos.setEtoWidgetError.getType():
      return {
        ...state,
        etoWidgetError: true,
      };
  }

  return state;
};
