import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

export type TEtoSetDateAdditionalData = {
  newStartDate: number;
};

export const EtoSetDateAdditionalDataSchema = YupTS.object({
  newStartDate: YupTS.string(),
});

export type TEtoSetDateAdditionalDataSchema = TypeOfYTS<typeof EtoSetDateAdditionalDataSchema>;
