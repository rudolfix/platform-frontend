import * as Yup from "yup";
import { IEtoFiles } from "./EtoFileApi.interfaces";

export const getSampleEtoFiles = (): IEtoFiles => ({
  etoTemplates: {},
  uploadedDocuments: {
    pamphlet: {
      url: "",
      status: "canReplace",
    },
    termSheet: {
      url: "",
      status: "canReplace",
    },
    infoBlatt: {
      url: "",
      status: "locked",
    },
    bafinProspectus: {
      url: "",
      status: "locked",
    },
    signedAgreement: {
      url: "",
      status: "locked",
    },
  },
});
