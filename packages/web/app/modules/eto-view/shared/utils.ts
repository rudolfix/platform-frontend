import { XOR } from "@neufund/shared";

import {
  EEtoState,
  ESocialChannelType,
  TCompanyEtoData,
  TEtoMediaData,
  TSocialChannelsType,
  TSocialChannelType,
} from "../../../lib/api/eto/EtoApi.interfaces.unsafe";

export const getTwitterUrl = (socialChannels: TSocialChannelsType | undefined) => {
  if (!socialChannels) {
    return undefined;
  } else {
    const twitterData = socialChannels.find(
      (c: TSocialChannelType) => c.type === ESocialChannelType.TWITTER,
    );
    return twitterData && twitterData.url;
  }
};

export const getTwitterData = (
  companyData: TEtoMediaData,
): XOR<{ showTwitterFeed: true; twitterUrl: string }, { showTwitterFeed: false }> => {
  const twitterUrl = getTwitterUrl(companyData.socialChannels);

  return !!twitterUrl && !companyData.disableTwitterFeed
    ? { showTwitterFeed: true, twitterUrl }
    : { showTwitterFeed: false };
};

export const shouldShowYouTube = (companyData: TCompanyEtoData) => !!companyData.companyVideo?.url;

export const shouldShowSlideshare = (companyData: TCompanyEtoData) =>
  !!companyData.companySlideshare?.url;

export const shouldShowSocialChannels = (companyData: TCompanyEtoData) =>
  !!companyData.socialChannels?.length;

export const shouldShowInvestmentTerms = (etoState: EEtoState) =>
  etoState !== EEtoState.PENDING && etoState !== EEtoState.PREVIEW;
