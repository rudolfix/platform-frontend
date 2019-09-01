import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";

// TODO: Replace state numbers by state names (like `LINK_NOMINEE`)
export enum EEtoStep {
  VERIFICATION = "verification",
  FILL_INFORMATION_ABOUT_COMPANY = "fill_information_about_company",
  PUBLISH_LISTING_PAGE = "publish_listing_page",
  LISTING_PAGE_IN_REVIEW = "listing_page_in_review",
  UPLOAD_SIGNED_TERMSHEET = "upload_signed_termsheet",
  PUBLISH_INVESTMENT_OFFER = "publish_investment_offer",
  SEVEN = "seven",
  EIGHT = "eight",
  NINE = "nine",
  LINK_NOMINEE = "link_nominee",
}

// TODO: This can be moved fully to redux selector
/**
 * Calculate current eto state
 * see ISSUER FLOW diagram in miro business logic details
 * @note Even when eto is in specific state in some cases it's still possible to access previous steps actions
 * (for e.g. publish marketing listing action is available until offer is fully published
 */
export const selectEtoStep = (
  isVerificationSectionDone: boolean,
  etoState: EEtoState,
  shouldViewEtoSettings: boolean,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview | undefined,
  isTermSheetSubmitted: boolean | undefined,
  isVotingRightsFilledWithAllRequired: boolean,
  isInvestmentAndEtoTermsFilledWithAllRequired: boolean,
): EEtoStep => {
  if (!isVerificationSectionDone) {
    return EEtoStep.VERIFICATION;
  }

  if (etoState === EEtoState.PREVIEW) {
    const areEtoFormsFilledWithAllRequired =
      isInvestmentAndEtoTermsFilledWithAllRequired && isVotingRightsFilledWithAllRequired;

    if (isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING) {
      return EEtoStep.LISTING_PAGE_IN_REVIEW;
    }

    if (areEtoFormsFilledWithAllRequired && isTermSheetSubmitted) {
      return EEtoStep.PUBLISH_INVESTMENT_OFFER;
    }

    if (areEtoFormsFilledWithAllRequired && !isTermSheetSubmitted) {
      return EEtoStep.UPLOAD_SIGNED_TERMSHEET;
    }

    /**
     * When both investment and eto terms forms are filled correctly
     * And when nominee is not linked yet
     * (`shouldViewSubmissionSection` return true when all eto forms,
     * including Token Holder Voting Right, are filled correctly)
     */
    if (isInvestmentAndEtoTermsFilledWithAllRequired && !areEtoFormsFilledWithAllRequired) {
      return EEtoStep.LINK_NOMINEE;
    }

    if (
      shouldViewEtoSettings &&
      isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.NOT_VISIBLE
    ) {
      return EEtoStep.PUBLISH_LISTING_PAGE;
    }

    return EEtoStep.FILL_INFORMATION_ABOUT_COMPANY;
  }

  if (etoState === EEtoState.PENDING) {
    return EEtoStep.SEVEN;
  }

  if (etoState === EEtoState.ON_CHAIN) {
    return EEtoStep.NINE;
  }

  return EEtoStep.EIGHT;
};
