import { TFormFixture } from "../utils/forms";

// about form
export const aboutForm: TFormFixture = {
  brandName: "Davecoin",
  companyWebsite: "https://neufund.org",
  companyOneliner: "Free icecream for all",
  companyDescription: "..also Beer!",
  keyQuoteFounder: "Let's make it a great day.",
  keyQuoteInvestor: "They're making it a great day!",
  "eto-about-category": {
    value: "Science",
    type: "tags",
  },
  "eto-registration-company-logo": {
    value: "example.png",
    type: "file",
  },
  "eto-registration-company-banner": {
    value: "example.png",
    type: "file",
  },
  "eto-registration-company-information-submit": {
    value: "",
    type: "submit",
  },
};

// legal info
export const legalInfoForm: TFormFixture = {
  vatNumber: "123456",
  foundingDate: {
    value: "22/02/99",
    type: "date",
  },
  numberOfEmployees: {
    value: "10-99",
    type: "select",
  },
  numberOfFounders: "3",
  companyStage: {
    value: "c_round",
    type: "select",
  },
  lastFundingSizeEur: "1000000",
  companyShares: "5000",
  "shareholders.0.fullName": "Marcin Rudolf",
  "shareholders.0.shares": "90",
  "eto-registration-legal-information-submit": {
    value: "",
    type: "submit",
  },
};

// investment terms
export const investmentTermsForm: TFormFixture = {
  shareNominalValueEur: "1",
  preMoneyValuationEur: "1000000",
  existingCompanyShares: "1000",
  authorizedCapitalShares: "100",
  minimumNewSharesToIssue: "10000",
  newSharesToIssue: "20000",
  newSharesToIssueInWhitelist: "5000",
  whitelistDiscountFraction: "20",
  "eto-registration-investment-terms-submit": {
    value: "",
    type: "submit",
  },
};

// eto terms
export const etoTermsForm: TFormFixture = {
  minTicketEur: "750",
  maxTicketEur: "10000",
  additionalTerms: "There must always be sausage in the fridge!",
  enableTransferOnSuccess: {
    value: "",
    type: "check",
  },
  "eto-registration-eto-terms-submit": {
    value: "",
    type: "submit",
  },
};

// key individuals
// @TODO also upload individuals fotos and add social channels
export const etoKeyIndividualsForm: TFormFixture = {
  "team.members.0.name": "Zoe",
  "team.members.0.role": "Boss",
  "team.members.0.description": "Yoga 4 life",
  "team.members.0.website": "http://www.zoe.com",

  "advisors.members.0.name": "Marcin",
  "advisors.members.0.role": "Boss",
  "advisors.members.0.description": "Yoga 4 life",
  "advisors.members.0.website": "http://www.zoe.com",

  "keyAlliances.members.0.name": "Dave",
  "keyAlliances.members.0.role": "Boss",
  "keyAlliances.members.0.description": "Yoga 4 life",
  "keyAlliances.members.0.website": "http://www.zoe.com",

  "boardMembers.members.0.name": "Moe",
  "boardMembers.members.0.role": "Boss",
  "boardMembers.members.0.description": "Yoga 4 life",
  "boardMembers.members.0.website": "http://www.zoe.com",

  "notableInvestors.members.0.name": "Gunther",
  "notableInvestors.members.0.role": "Boss",
  "notableInvestors.members.0.description": "Yoga 4 life",
  "notableInvestors.members.0.website": "http://www.zoe.com",

  "keyCustomers.members.0.name": "Hognob",
  "keyCustomers.members.0.role": "Boss",
  "keyCustomers.members.0.description": "Yoga 4 life",
  "keyCustomers.members.0.website": "http://www.zoe.com",

  "partners.members.0.name": "Blabla",
  "partners.members.0.role": "Boss",
  "partners.members.0.description": "Yoga 4 life",
  "partners.members.0.website": "http://www.zoe.com",

  "eto-registration-key-individuals-submit": {
    value: "",
    type: "submit",
  },
};

// product vision form
export const productVisionForm: TFormFixture = {
  inspiration: "Something about inspiration",
  companyMission: "Something about the mission",
  productVision: "Something about the vision",
  problemSolved: "Something about the key problem",
  customerGroup: "Who do we target?",
  targetMarketAndIndustry: "Target market and industry",
  keyCompetitors: "Key competition",
  sellingProposition: "The selling prop",
  keyBenefitsForInvestors: "Benefits for our investors",
  useOfCapital: "Cash is all around me",
  "useOfCapitalList.0.description": "Food",
  "useOfCapitalList.0.percent": "30",
  "useOfCapitalList.1.description": "Yoga",
  "useOfCapitalList.1.percent": "65",
  marketTraction: "Something about the market traction",
  roadmap: "Our roadmap",
  businessModel: "A great one for sure",
  marketingApproach: "Our Marketing",

  "eto-registration-product-vision-submit": {
    value: "",
    type: "submit",
  },
};

// media form
export const mediaForm: TFormFixture = {
  "companyVideo.url": "https://www.youtube.com/watch?v=oHg5SJYRHA0",
  "companySlideshare.url": "https://neufund.org/",
  "socialChannels.0.url": "https://twitter.com/neufundorg?lang=en",
  "companyNews.0.publication": "Publication name",
  "companyNews.0.url": "https://neufund.org/",
  "companyNews.0.title": "The neufund chronicle",
  "marketingLinks.0.url": "https://neufund.org/",
  "marketingLinks.0.title": "Another marketing resource",

  "eto-registration-media-submit": {
    value: "",
    type: "submit",
  },
};

// risk form
export const riskForm: TFormFixture = {
  riskLiquidityDescription: "Info about liquidity risks",
  riskThirdPartyDescription: "Third party financing risks",
  riskThirdPartySharesFinancing: "Third party shares risks",
  riskBusinessModelDescription: "Business Model Risks",
  riskMaxDescription: "Maximum risks",

  "eto-registration-risk-submit": {
    value: "",
    type: "submit",
  },
};

// token info
export const equityTokenInfoForm: TFormFixture = {
  equityTokenName: "Sharpcoin",
  equityTokenSymbol: "X#C",
  "eto-registration-token-logo": {
    value: "example.png",
    type: "file",
  },
  "eto-registration-token-info-submit": {
    value: "",
    type: "submit",
  },
};

// voting rights
export const votingRights: TFormFixture = {
  liquidationPreferenceMultiplier: {
    value: "1.5",
    type: "select",
  },
  "eto-registration-voting-rights-submit": {
    value: "",
    type: "submit",
  },
};
