import { expect } from "chai";

import { ESocialChannelType } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { getTwitterData, getTwitterUrl } from "./utils";

const socialChannels = [
  {
    type: ESocialChannelType.FACEBOOK,
    url: "bla",
  },
  {
    type: ESocialChannelType.LINKEDIN,
    url: "blabla",
  },
];

const twitter = {
  type: ESocialChannelType.TWITTER,
  url: "twitter_url",
};

describe("eto view utils", () => {
  it("getTwitterUrl: socialChannels is undefined", () => {
    expect(getTwitterUrl(undefined)).to.be.undefined;
  });
  it("getTwitterUrl: socialChannels includes twitter", () => {
    expect(getTwitterUrl([...socialChannels, twitter])).to.eq("twitter_url");
  });
  it("getTwitterUrl: socialChannels doesn't include twitter", () => {
    expect(getTwitterUrl([...socialChannels])).to.be.undefined;
  });

  it("getTwitterData: socialChannels doesn't include twitter", () => {
    const companyData = {
      companyVideo: undefined,
      companySlideshare: undefined,
      companyPitchdeckUrl: undefined,
      companyNews: undefined,
      marketingLinks: undefined,
      socialChannels: [...socialChannels],
      disableTwitterFeed: false,
    };

    expect(getTwitterData(companyData)).to.deep.eq({ showTwitterFeed: false });
  });
  it("getTwitterData: socialChannels include twitter, twitter feed disabled", () => {
    const companyData = {
      companyVideo: undefined,
      companySlideshare: undefined,
      companyPitchdeckUrl: undefined,
      companyNews: undefined,
      marketingLinks: undefined,
      socialChannels: [...socialChannels, twitter],
      disableTwitterFeed: true,
    };

    expect(getTwitterData(companyData)).to.deep.eq({ showTwitterFeed: false });
  });
  it("getTwitterData: socialChannels include twitter, twitter feed enabled", () => {
    const companyData = {
      companyVideo: undefined,
      companySlideshare: undefined,
      companyPitchdeckUrl: undefined,
      companyNews: undefined,
      marketingLinks: undefined,
      socialChannels: [...socialChannels, twitter],
      disableTwitterFeed: false,
    };

    expect(getTwitterData(companyData)).to.deep.eq({
      showTwitterFeed: true,
      twitterUrl: "twitter_url",
    });
  });
});
