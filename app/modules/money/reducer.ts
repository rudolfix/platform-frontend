import { AppReducer } from "../../store";

export type TCurrency = "neu" | "eur" | "eur_token" | "eth";

export interface IMoneyState {
  euroTokenDecimals: number;
  etherTokenDecimals: number;
  neumarkTokenDecimals: number;
  eurDecimals: number;
}

export const moneyInitState: IMoneyState = {
  euroTokenDecimals: 18,
  etherTokenDecimals: 18,
  neumarkTokenDecimals: 18,
  eurDecimals: 18,
};

export const moneyReducer: AppReducer<IMoneyState> = (
  state = moneyInitState,
  _action,
): IMoneyState => {
  return state;
};

export const selectDecimals = (state: IMoneyState, currency: TCurrency): number => {
  switch (currency) {
    case "eth":
      return state.etherTokenDecimals;
    case "eur":
      return state.eurDecimals;
    case "eur_token":
      return state.euroTokenDecimals;
    case "neu":
      return state.neumarkTokenDecimals;
  }
};
