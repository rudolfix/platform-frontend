import * as Yup from "yup";

type fileStates = "canReplace" | "locked" | "readOnly";

export const getSampleEtoFiles = (): object => ({
  pamphlet: {
    url: "",
    status: "locked",
  },
  termSheet: {
    url: "url",
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
});

export interface IEtoSingleFile {
  url: string;
  status: fileStates;
}

export const etoFileSchema = Yup.object().shape({
  url: Yup.string().required(),
  status: Yup.string().required(),
});
