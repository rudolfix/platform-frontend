import * as Yup from "yup";
import { IEtoFiles } from "./EtoFileApi.interfaces";

export const getSampleEtoFiles = (): IEtoFiles => ({
  generatedDocuments: [
    {
      title: "Term Sheat",
      url: "example.pdf",
    },
    {
      title: "Info Blatt",
      url: "example.doc",
    },
    {
      title: "Bafin Prospectus",
      url: "",
    },
  ],
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

export const etoFileSchema = Yup.object().shape({
  url: Yup.string().required(),
  status: Yup.string().required(),
});
