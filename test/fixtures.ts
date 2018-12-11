import { createStore, Store } from "redux";
import { BigNumber } from "bignumber.js";

import { IConfig } from "../app/config/getConfig";
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../app/types";

export const dummyConfig: IConfig = {
  ethereumNetwork: {
    rpcUrl: "https://localhost:8080",
  },
  contractsAddresses: {
    universeContractAddress: "UNIVERSE_ADDRESS",
  },
};

export const dummyNetworkId: EthereumNetworkId = "5" as EthereumNetworkId;

export function createDummyStore(): Store<any> {
  return createStore(() => {});
}

export const dummyEthereumAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359" as EthereumAddress;
export const dummyEthereumAddressWithChecksum = "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359" as EthereumAddressWithChecksum;

export const testCompany = {
  advisors: {
    members: [
      {
        description:
          "André Eggert is a partner at LACORE. He advises companies and entrepreneurs as well as investors. One of his core activities is the support of M&A and financing transactions.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/9859a896-513d-42bd-a17b-2b020b7e5c1f.jpg",
        name: "André Eggert",
        role: "Legal Architect",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  boardMembers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  brandName: "Neufund",
  categories: ["Technology", "Blockchain", "Fintech"],
  city: "Berlin",
  companyDescription:
    "Blockchain based equity fundraising platform, ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. Neufund is a Blockchain protocol for securities’ tokenization and issuance.",
  companyId: "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0",
  companyLogo:
    "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/ccaf9ab7-fae1-41df-aa72-cf931abd5931.png",
  companyNews: [
    {
      publication: "Econotimes",
      title:
        "Neufund joins Malta Stock-Exchange and Binance to build blockchain-based exchange for equity tokens",
      url:
        "https://www.econotimes.com/Neufund-joins-Malta-Stock-Exchange-and-Binance-to-build-blockchain-based-exchange-for-equity-tokens-1405589",
    },
    {
      publication: "Neufund",
      title: "ETO with Neufund",
      url: "https://neufund.org/cms_resources/fundraising-process-with-neufund.pdf%C2%A0",
    },
  ],
  companyOneliner: "Equity Fundraising on Blockchain",
  companyShares: 40859,
  companySlideshare: {
    title: "",
    url: "",
  },
  companyVideo: {
    title: "",
    url: "https://www.youtube.com/watch?v=M0Hhl27TPR4",
  },
  disableTwitterFeed: true,
  companyWebsite: "https://neufund.org",
  country: "DE",
  etos: [],
  foundingDate: "2016-08-18",
  jurisdiction: "DE",
  keyAlliances: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  keyCustomers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  lastFundingSizeEur: 8000000,
  keyQuoteFounder:
    "'Neufunds ETOs are changing the space by offering direct, transparent and, most importantly, legally binding investment rounds on the blockchain, which is an attractive proposition to both companies and investors. - Frank Thelen, Freigeist VC'",
  legalForm: "Company Legal Form",
  marketingLinks: [
    {
      title: "Pitch Deck",
      url:
        "https://docs.google.com/presentation/d/14mRlEDSNAMWybfgYFJUJyE8oEps0VJPIoaYfmmpZTmw/edit#slide=id.g3e534cab92_0_70",
    },
  ],
  name: "Company Name ISSUER_SIGNING",
  notableInvestors: {
    members: [
      {
        description:
          "Frank Thelen is a European serial founder, tech investor and TV personality. As the Founder & CEO of Venture capitalist Freigeist Capital, he focuses on seed investments like Lilium Aviation, Wunderlist, myTaxi, kaufDA and Little Lunch.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/7c1886da-75cb-47cd-a870-bd3b0cd2f28e.jpg",
        name: "Frank Thelen",
        role: "CEO at Freigeist Capital",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@frank_thelen",
          },
          {
            type: "twitter",
            url: "https://twitter.com/frank_thelen",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/frank-thelen/",
          },
        ],
      },
    ],
  },
  numberOfEmployees: "10-99",
  numberOfFounders: 2,
  partners: {
    members: [
      {
        description:
          "Binance is a blockchain ecosystem comprised of Exchange, Labs, Launchpad, Info and Charity Foundation. Binance Exchange is one of the fastest growing and most popular cryptocurrency exchanges in the world.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3ed7489d-399f-46c7-a038-e423b7a94244.png",
        name: "Binance",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/binance",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
        website: "https://www.binance.com/",
      },
      {
        description:
          "The Malta Stock Exchange became a reality upon enactment of the Malta Stock Exchange Act in 1990, and commenced its trading operations on 8 January 1992.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3405980f-3bcd-48d6-aeb7-ae9cc272b984.jpg",
        name: "Malta Stock Exchange",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/MaltaStockExch",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  productVision:
    "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. At its technological core, Neufund is a Blockchain protocol for securities’ tokenization and issuance - it allows for any type of security or financial product to be issued as a token on a Blockchain, and Equity Tokens are just one of many types.",
  registrationNumber: "1234",
  riskNoLoansExist: true,
  riskNoThirdPartyDependency: true,
  riskNotRegulatedBusiness: true,
  schemaVersion: 1,
  sellingProposition:
    "Neufund’s Equity Token Offering (ETO) is a novel way of fundraising, which allows any kind of company (blockchain-based or not) to issue equity tokens on a Blockchain, in a public or private placement. An ETO is a hybrid investment model combining advantages of an IPO, an ICO, and a VC round. Typically it is accompanied by a campaign or a roadshow which informs investors about the offering. Thus, an ETO is an ideal way to build a clients’ ecosystem around the company or a product.",
  shareholders: [
    {
      fullName: "Miau Capital GmbH",
      shares: 14000,
    },
    {
      fullName: "Rudolfix Software Insights UG",
      shares: 14000,
    },
    {
      fullName: "Triotor Beteiligungs GmbH",
      shares: 2000,
    },
    {
      fullName: "Atlantic Labs",
      shares: 5000,
    },
    {
      fullName: "Freigeist Capital I",
      shares: 5500,
    },
  ],
  socialChannels: [
    {
      type: "twitter",
      url: "https://twitter.com/neufundorg",
    },
    {
      type: "facebook",
      url: "https://www.facebook.com/neufundorg/",
    },
    {
      type: "linkedin",
      url: "https://www.linkedin.com/company/neufund/",
    },
    {
      type: "slack",
      url: "",
    },
    {
      type: "medium",
      url: "https://blog.neufund.org",
    },
    {
      type: "reddit",
      url: "https://www.reddit.com/r/neufund",
    },
    {
      type: "telegram",
      url: "https://t.me/neufund",
    },
    {
      type: "github",
      url: "https://github.com/Neufund/",
    },
    {
      type: "instagram",
      url: "",
    },
    {
      type: "gplus",
      url: "",
    },
    {
      type: "youtube",
      url: "",
    },
    {
      type: "xing",
      url: "",
    },
    {
      type: "bitcointalk",
      url: "",
    },
  ],
  street: "Cuvrystr 6",
  team: {
    members: [
      {
        description:
          "Being a Blockchain regulatory & security tokens experts Zoe actively advises to German and Maltese governments on DLT frameworks. Former Co-founder and CEO at Xyologic Mobile Analysis GmbH. Occasional angel investor. Mentor at Gaza Sky Geeks.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/11b3ec40-5bef-46fd-8e0a-b18e68a0a0fc.jpg",
        name: "Zoe Adamovicz",
        role: "CEO & Co-Founder",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@ZoeAdamovicz",
          },
          {
            type: "twitter",
            url: "https://twitter.com/zoeadamovicz",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/zoeadamovicz/",
          },
        ],
        website: "https://technologiaizycie.pl/",
      },
      {
        description:
          "Serial CTO and founder. Co-founder and CTO at Xyologic Mobile Analysis GmbH (exit: Digital Turbine Inc.), Head of Group Technology at Digital Turbine. Experienced in tech, from coding in assembly to managing tech teams in companies such as H&P.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/c520447a-90d8-490f-af27-16625f380b07.jpg",
        name: "Marcin Rudolf",
        role: "CTO & Co-Founder",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@rudolfix",
          },
          {
            type: "twitter",
            url: "https://twitter.com/rudolfix",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/marcinrudolf/",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/64f2b86f-1daf-45c3-9168-b0271a6d19c0.jpg",
        name: "Agnieszka Sarnecka",
        role: "VP Ventures",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/2f99640f-3a3f-4f31-85fc-a11ee2dbe084.jpg",
        name: "Sergiej Rewiakin",
        role: "VP Engineering",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
        website: "http://sergiej.com",
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/301abd44-1775-4991-b616-536069408fe1.jpg",
        name: "Piotr Panorski",
        role: "VP Trading",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/8fea024d-97e0-4878-bcbf-3d6538aac924.jpg",
        name: "Ula Lachowicz",
        role: "VP Marketing",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
    ],
  },
  useOfCapitalList: [
    {
      description: "Development",
      percent: 0.4,
    },
    {
      description: "Legal",
      percent: 0.3,
    },
    {
      description: "Marketing",
      percent: 0.2,
    },
    {
      description: "Operations",
      percent: 0.1,
    },
  ],
  vatNumber: "18.08.2016",
  zipCode: "12345",
};

export const testEto = {
  allowRetailInvestors: true,
  canEnableBookbuilding: false,
  claimDurationDays: 10,
  companyId: "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0",
  currencies: ["eth", "eur_t"],
  discountScheme: "40%",
  documents: {
    qmWKa6ZVZjZu3X2CtJnSnthUwWMeAcyfv9IZDnoawmULeT: {
      documentType: "approved_investor_offering_document",
      form: "document",
      ipfsHash: "QmWKa6zVZjZu3x2CtJnSNTHUwWMeAcyfv9iZDnoawmULeT",
      mimeType: "application/pdf",
      name: "./dev_fixtures/eto_fixtures/ETOInPublicState/investor_offering_document.pdf",
    },
    qmc4RZuxqKkvRahSuhs6QaeRq2VoqDiMXbiHwhZTfwXUdK: {
      documentType: "signed_termsheet",
      form: "document",
      ipfsHash: "Qmc4rZUXQKkvRahSUHS6qaeRq2voqDiMXbiHwhZTfwXUdK",
      mimeType: "application/pdf",
      name: "./dev_fixtures/eto_fixtures/ETOInPublicState/signed_termsheet.pdf",
    },
  },
  enableTransferOnSuccess: false,
  equityTokenContractAddress: "0xbAb1B125ba8b4A3161b7543a4cAA38De7f9c9b2D",
  equityTokenControllerContractAddress: "0xd36F021bEb5d404b65a639330331E7C39a037C02",
  equityTokenImage:
    "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/a03810cf-7e99-4264-8a94-24303dce4e3b.png",
  equityTokenName: "Quintessence",
  equityTokenPrecision: 0,
  equityTokenSymbol: "QTT",
  equityTokensPerShare: 10000,
  etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
  etoTermsContractAddress: "0x948f07847e19E7dBb98DdfFdCA4b2eDF71f3E3B5",
  existingCompanyShares: 40976,
  fixedSlotsMaximumDiscountFraction: 0.5,
  generalVotingDurationDays: 10,
  generalVotingRule: "positive",
  hasDragAlongRights: true,
  hasFoundersVesting: true,
  hasGeneralInformationRights: true,
  hasTagAlongRights: true,
  isBookbuilding: false,
  liquidationPreferenceMultiplier: 0.5,
  maxPledges: 500,
  maxTicketEur: 10000000,
  minTicketEur: 100,
  minimumNewSharesToIssue: 1000,
  newSharesToIssue: 3452,
  newSharesToIssueInWhitelist: 1534,
  nominee: "0xCB6470fa4b5D56C8f494e7c1CE56B28c548931a6",
  notUnderCrowdfundingRegulations: true,
  preMoneyValuationEur: 132664672.0464,
  previewCode: "deabb8a4-d081-4d15-87a7-737a09e6a87c",
  prospectusLanguage: "de",
  publicDiscountFraction: 0,
  publicDurationDays: 14,
  restrictedActVotingDurationDays: 14,
  schemaVersion: 1,
  shareNominalValueEur: 1,
  signingDurationDays: 14,
  startDate: "2018-11-16T05:03:56+00:00",
  state: "on_chain",
  tagAlongVotingRule: "negative",
  templates: {
    companyTokenHolderAgreement: {
      documentType: "company_token_holder_agreement",
      form: "template",
      ipfsHash: "QmPKDB129q8AxxtTiX5eh9MPF6K1da5sHfqMv1a788BbuM",
      language: "en",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "company_token_holder_agreement",
    },
    investmentAndShareholderAgreementTemplate: {
      documentType: "investment_and_shareholder_agreement_template",
      form: "template",
      ipfsHash: "QmUktiTT9ap8UuMUMZNmgrz7fabHMkrosycuTPUtX3rydQ",
      language: "en",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "investment_and_shareholder_agreement_template",
    },
    prospectusTemplate: {
      documentType: "prospectus_template",
      form: "template",
      ipfsHash: "QmQYWyx6WWwCYqBnJ74ruogTTHfKoscQRHU5eJFKDD22mT",
      language: "de",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "prospectus_template_de",
    },
    reservationAndAcquisitionAgreement: {
      documentType: "reservation_and_acquisition_agreement",
      form: "template",
      ipfsHash: "QmekA9D4pa5Tsmd2krzUFFREGAduDDkbpNyoin4wX7aaob",
      language: "en",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "reservation_and_acquisition_agreement",
    },
    termsheetTemplate: {
      documentType: "termsheet_template",
      form: "template",
      ipfsHash: "QmRLwyTw4ux84KnYvhejTsUggi2SeewGqASuh3DrURtyot",
      language: "en",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "termsheet_template",
    },
  },
  tokenholdersQuorum: 0.5,
  votingFinalizationDurationDays: 7,
  votingMajorityFraction: 0.5,
  whitelistDiscountFraction: 0.3,
  whitelistDurationDays: 7,
  company: testCompany,
  contract: {
    timedState: 3,
    totalInvestment: {
      totalEquivEurUlps: "3.240447910281246044e+24",
      totalTokensInt: "10010705",
      totalInvestors: new BigNumber("3"),
      euroTokenBalance: "3.2374649e+24",
      etherTokenBalance: "5432420000000000000",
    },
    startOfStates: {
      "1": new Date("2018-11-16T05:03:56.000Z"),
      "2": new Date("2018-11-23T05:03:56.000Z"),
      "3": new Date("2018-12-07T05:03:56.000Z"),
      "4": new Date("2018-12-21T05:03:56.000Z"),
      "5": new Date("2018-12-31T05:03:56.000Z"),
    },
  },
};
