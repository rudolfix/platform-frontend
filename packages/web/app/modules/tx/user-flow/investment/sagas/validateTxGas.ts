import { ITxData } from "../../../../../lib/web3/types";
import { NotEnoughEtherForGasError } from "../../../../../lib/web3/Web3Adapter";
import { neuCall } from "../../../../sagasUtils";
import { EValidationState } from "../../../validator/reducer";
import { validateGas } from "../../../validator/sagas";

export function* validateTxGas(investmentTransaction: ITxData): Generator<any, any, any> {
  //this is just a wrapper for validateGas that uses exceptions to express validation results.
  try {
    yield neuCall(validateGas, investmentTransaction);

    return EValidationState.VALIDATION_OK;
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      return EValidationState.NOT_ENOUGH_ETHER_FOR_GAS;
    } else {
      throw error;
    }
  }
}
