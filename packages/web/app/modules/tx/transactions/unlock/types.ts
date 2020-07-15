import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

export type TUnlockAdditionalData = {
  etherNeumarksDue: string;
  lockedEtherUnlockDate: string;
  lockedEtherBalance: string;
};

export const UnlockAdditionalDataSchema = YupTS.object({
  etherNeumarksDue: YupTS.string(),
  lockedEtherUnlockDate: YupTS.string(),
  lockedEtherBalance: YupTS.string(),
});

export type TUnlockAdditionalDataYTS = TypeOfYTS<typeof UnlockAdditionalDataSchema>;
