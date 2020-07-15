import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

export const ExecuteResolutionAdditionalDataSchema = YupTS.object({
  documentTitle: YupTS.string(),
  type: YupTS.string(),
});

export type TExecuteResolutionAdditionalData = TypeOfYTS<
  typeof ExecuteResolutionAdditionalDataSchema
>;
