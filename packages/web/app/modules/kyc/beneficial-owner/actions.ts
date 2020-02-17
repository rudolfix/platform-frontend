import { createActionFactory } from "@neufund/shared";

import { IKycBeneficialOwner, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";

export const kycBeneficialOwnerActions = {
  kycLoadBeneficialOwners: createActionFactory("KYC_LOAD_BENEFICIAL_OWNERS"),
  kycUpdateBeneficialOwners: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNERS",
    (loadingBeneficialOwners: boolean, beneficialOwners: IKycBeneficialOwner[] = []) => ({
      loadingBeneficialOwners,
      beneficialOwners,
    }),
  ),
  kycDeleteBeneficialOwner: createActionFactory("KYC_DELETE_BENEFICIAL_OWNER", (id: string) => ({
    id,
  })),
  kycSubmitBeneficialOwner: createActionFactory(
    "KYC_SUBMIT_BENEFICIAL_OWNER",
    (owner: IKycBeneficialOwner, id: string) => ({ owner, id }),
  ),
  kycUpdateBeneficialOwner: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNER",
    (loadingBeneficialOwner: boolean, id?: string, beneficialOwner?: IKycBeneficialOwner) => ({
      loadingBeneficialOwner,
      id,
      beneficialOwner,
    }),
  ),

  // documents
  kycLoadBeneficialOwnerDocumentList: createActionFactory(
    "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST",
    (boid: string) => ({ boid }),
  ),

  kycUploadBeneficialOwnerDocument: createActionFactory(
    "KYC_UPLOAD_BENEFICIAL_OWNER_FILE",
    (file: File, values: IKycBeneficialOwner) => ({
      file,
      values,
    }),
  ),

  kycUpdateBeneficialOwnerDocuments: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNER_FILES_INFO",
    (
      boid: string,
      beneficialOwnerFilesLoading: boolean,
      beneficialOwnerFiles: IKycFileInfo[] = [],
    ) => ({
      boid,
      beneficialOwnerFilesLoading,
      beneficialOwnerFiles,
    }),
  ),
  kycUpdateBeneficialOwnerDocument: createActionFactory(
    "KYC_UPDATE_BENEFICIAL_OWNER_FILE_INFO",
    (boid: string, beneficialOwnerFileUploading: boolean, file?: IKycFileInfo) => ({
      boid,
      beneficialOwnerFileUploading,
      file,
    }),
  ),

  // modal
  kycToggleBeneficialOwnerModal: createActionFactory(
    "KYC_TOGGLE_BENEFICIAL_OWNER_MODAL",
    (show: boolean, boId?: string) => ({
      show,
      boId,
    }),
  ),
};
