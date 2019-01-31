import { IAppState } from "../../store";

export const selectDownloadAgrementModalIsOpen = (state: IAppState): boolean => {
  return state.portfolioDownloadAgreementsModal.isOpen;
};

export const selectDownloadAgreementModalEtoId = (state: IAppState): string | undefined => {
  return state.portfolioDownloadAgreementsModal.etoId;
};

export const selectDownloadAgreementModalIsRetailEto = (state: IAppState): boolean | undefined => {
  return state.portfolioDownloadAgreementsModal.isRetailEto;
};
