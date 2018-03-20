import { TGlobalDependencies } from "../../di/setupBindings";

export async function initializeContracts({ contractsService }: TGlobalDependencies) {
  return await contractsService.init();
}
