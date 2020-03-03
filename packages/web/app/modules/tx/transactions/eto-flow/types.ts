import * as YupTS from "../../../../lib/yup-ts.unsafe";

export type TEtoSetDateAdditionalData = {
  newStartDate: number;
};

export const EtoSetDateAdditionalDataSchema = YupTS.object({
  newStartDate: YupTS.string(),
});

export type TEtoSetDateAdditionalDataSchema = YupTS.TypeOf<typeof EtoSetDateAdditionalDataSchema>;
