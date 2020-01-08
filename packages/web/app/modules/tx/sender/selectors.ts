import { IAppState } from "../../../store";
import { multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { selectStandardGasPriceWithOverHead } from "../../gas/selectors";
import { selectEtherPriceEur } from "../../shared/tokenPrice/selectors";
import { INVESTMENT_GAS_AMOUNT } from "../transactions/investment/sagas";
import { ETxSenderType, TAdditionalDataByType } from "../types";
import { ETxSenderState } from "./reducer";

export const selectTxSenderModalOpened = (state: IAppState) =>
  state.txSender.state !== ETxSenderState.UNINITIALIZED;

export const selectTxDetails = (state: IAppState) => state.txSender.txDetails;

export const selectTxType = (state: IAppState) => state.txSender.type;

export const selectTxAdditionalData = <T extends ETxSenderType>(
  state: IAppState,
): TAdditionalDataByType<T> | undefined => state.txSender.additionalData;

export const selectTxTimestamp = (state: IAppState): number | undefined =>
  state.txSender.txTimestamp;

export const selectTxGasCostEthUlps = (state: IAppState): string => {
  const details = selectTxDetails(state);
  const gasPrice = details?.gasPrice ?? "0";
  const gasLimit = details?.gas ?? "0";
  return multiplyBigNumbers([gasPrice, gasLimit]);
};

export const selectFakeTxGasCostEthUlps = (state: IAppState): string => {
  const gasPrice = selectStandardGasPriceWithOverHead(state);
  return multiplyBigNumbers([gasPrice, INVESTMENT_GAS_AMOUNT]);
};

export const selectTxGasCostEurUlps = (state: IAppState): string =>
  multiplyBigNumbers([selectEtherPriceEur(state), selectTxGasCostEthUlps(state)]);
