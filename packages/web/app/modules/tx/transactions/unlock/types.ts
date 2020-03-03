import * as YupTS from "../../../../lib/yup-ts.unsafe";

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

export type TUnlockAdditionalDataYTS = YupTS.TypeOf<typeof UnlockAdditionalDataSchema>;
