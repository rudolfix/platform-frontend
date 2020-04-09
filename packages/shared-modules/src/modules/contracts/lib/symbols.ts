import { createLibSymbol } from "../../../utils";
import { IContractsService } from "./ContractService";

export const symbols = {
  contractsService: createLibSymbol<IContractsService>("contractsService"),
};
