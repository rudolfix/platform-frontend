import { ETxType, IEtoDocument, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";

export const selectDocument = (
  txType: ETxType | undefined,
  nomineeEto: TEtoWithCompanyAndContractReadonly,
): IEtoDocument => {
  switch (txType) {
    case ETxType.NOMINEE_THA_SIGN:
      return nomineeEto.templates.companyTokenHolderAgreement;
    case ETxType.NOMINEE_RAAA_SIGN:
      return nomineeEto.templates.reservationAndAcquisitionAgreement;
    default:
      throw new Error("Incorrect transaction type");
  }
};

export const isRAASign = (txType: ETxType | undefined) => txType === ETxType.NOMINEE_RAAA_SIGN;
