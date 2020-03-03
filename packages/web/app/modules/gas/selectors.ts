import { GasModelShape } from "../../lib/api/gas/GasApi";
import { TAppGlobalState } from "../../store";
import { calculateGasPriceWithOverhead } from "../tx/utils";

export const selectIsGasPriceAlreadyLoaded = (state: TAppGlobalState): boolean =>
  !state.gas.loading && !!state.gas.gasPrice;

export const selectGasPrice = (state: TAppGlobalState): GasModelShape | undefined =>
  state.gas.gasPrice;

export const selectStandardGasPrice = (state: TAppGlobalState): string =>
  (state.gas.gasPrice && state.gas.gasPrice.standard) || "0";

export const selectStandardGasPriceWithOverHead = (state: TAppGlobalState): string =>
  (state.gas.gasPrice && calculateGasPriceWithOverhead(state.gas.gasPrice.standard)) || "0";
