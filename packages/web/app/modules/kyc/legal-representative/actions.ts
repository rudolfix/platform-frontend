import { createActionFactory } from "@neufund/shared-utils";

import { IKycFileInfo, IKycLegalRepresentative } from "../../../lib/api/kyc/KycApi.interfaces";

export const kycLegalRepresentativeActions = {
  // data
  kycSubmitLegalRepresentative: createActionFactory(
    "KYC_SUBMIT_LEGAL_REPRESENTATIVE",
    (data: IKycLegalRepresentative) => ({ data }),
  ),

  kycLoadLegalRepresentative: createActionFactory("KYC_LOAD_LEGAL_REPRESENTATIVE"),

  kycUpdateLegalRepresentative: createActionFactory(
    "KYC_UPDATE_LEGAL_REPRESENTATIVE",
    (legalRepresentativeLoading?: boolean, legalRepresentative?: IKycLegalRepresentative) => ({
      legalRepresentative,
      legalRepresentativeLoading,
    }),
  ),

  // documents
  kycLoadLegalRepresentativeDocumentList: createActionFactory(
    "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST",
  ),

  kycUploadLegalRepresentativeDocument: createActionFactory(
    "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE",
    (file: File) => ({ file }),
  ),

  kycUpdateLegalRepresentativeDocuments: createActionFactory(
    "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILES_INFO",
    (legalRepresentativeFilesLoading: boolean, legalRepresentativeFiles: IKycFileInfo[] = []) => ({
      legalRepresentativeFilesLoading,
      legalRepresentativeFiles,
    }),
  ),

  kycUpdateLegalRepresentativeDocument: createActionFactory(
    "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILE_INFO",
    (legalRepresentativeUploading: boolean, file?: IKycFileInfo) => ({
      legalRepresentativeUploading,
      file,
    }),
  ),

  // modal
  toggleLegalRepresentativeModal: createActionFactory(
    "KYC_TOGGLE_LEGAL_REPRESENTATIVE_MODAL",
    (show: boolean) => ({
      show,
    }),
  ),
};
