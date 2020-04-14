import { createLibSymbol } from "@neufund/shared-modules";

import { ContractsService } from "./ContractsService";

export const privateSymbols = {
  universeContractAddress: createLibSymbol<string>("universeContractAddress"),
};

export const symbols = {
  contractsService: createLibSymbol<ContractsService>("contractsService"),
};
