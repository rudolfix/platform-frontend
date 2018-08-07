import * as Yup from "yup";
import { IEtoFiles } from "./EtoFileApi.interfaces";

export const getSampleEtoFiles = (): IEtoFiles => ({
  links: [
    {
      name: "Term Sheet",
      url: "",
    },
    {
      name: "Prospectus EN",
      url: "test.pdf",
    },
    {
      name: "Prospectus DE",
      url: "test.doc",
    },
    {
      name: "Reservation and Acquisition Agreement",
      url: "test.pdf",
    },
    {
      name: "Token Holder Agreement",
      url: "test.pdf",
    },
    {
      name: "Investment and Shareholder Agreement",
      url: "test.pdf",
    },
  ],
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
