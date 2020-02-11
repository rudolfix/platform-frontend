import { TAppGlobalState } from "../../store";

export const selectDownloadAgrementModalIsOpen = (state: TAppGlobalState): boolean =>
  state.portfolioDownloadAgreementsModal.isOpen;

export const selectDownloadAgreementModalEtoId = (state: TAppGlobalState): string | undefined =>
  state.portfolioDownloadAgreementsModal.etoId;

export const selectDownloadAgreementModalIsRetailEto = (
  state: TAppGlobalState,
): boolean | undefined => state.portfolioDownloadAgreementsModal.isRetailEto;
