import { TGeneralEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction } from "../actionsUtils";

export const etoActions = {
  loadEtoPreviewStart: (previewCode: string) =>
    createAction("ETO_FLOW_LOAD_ETO_PREVIEW_START", { previewCode }),
  loadEtoPreview: (previewCode: string, data: Partial<TGeneralEtoData>) =>
    createAction("ETO_FLOW_LOAD_ETO_PREVIEW", { previewCode, data }),
};
