import { TGlobalDependencies } from "../../di/setupBindings";

export async function initializeContracts({
  contractsService,
}: TGlobalDependencies): Promise<void> {
  await contractsService.init();
}
