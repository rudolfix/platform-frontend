import * as YupTS from "../../../../lib/yup-ts.unsafe";

export const ExecuteResolutionAdditionalDataSchema = YupTS.object({
  documentTitle: YupTS.string(),
  type: YupTS.string(),
});

export type TExecuteResolutionAdditionalData = YupTS.TypeOf<
  typeof ExecuteResolutionAdditionalDataSchema
>;
