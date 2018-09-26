import { GasModelShape } from '../../lib/api/GasApi';
import { IGasState } from "./reducer";

export const selectIsAlreadyLoaded = (state: IGasState): boolean =>
  !state.loading && !!state.gasPrice;

export const selectGasPrice = (state: IGasState): GasModelShape | undefined => state.gasPrice;
