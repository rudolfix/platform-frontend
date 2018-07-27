import * as Yup from "yup";
import { IEtoFiles } from "./EtoFileApi.interfaces";

export const getSampleEtoFiles = (): IEtoFiles => ({
  links: [
    {
      name: "test file sdafasdf asd",
      url: "",
    },
    {
      name: "test file fdag hasf",
      url: "test.pdf",
    },
    {
      name: "test file asdf gasd",
      url: "test.doc",
    },
    {
      name: "test file",
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
      status: "locked",
    },
    termSheet: {
      url: "",
      status: "locked",
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
