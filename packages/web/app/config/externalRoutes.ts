const neufundSupport = "https://support.neufund.org/support";
const neufundOrg = "https://neufund.org";

const etherscanAddress = "https://etherscan.io/address/:address";

export const externalRoutes = {
  neufundSupport,
  neufundSupportNewTicket: `${neufundSupport}/tickets/new`,
  neufundSupportHome: `${neufundSupport}/home`,
  neufundSupportWhatIsNeu: `${neufundSupport}/solutions/articles/36000060355-what-is-neumark-`,
  neufundSupportVotingGuide: `${neufundSupport}/solutions/articles/36000229673`,
  neufundInvest: `${neufundOrg}/invest`,
  neufundBlogChangeIsComing: "https://blog.neufund.org/change-is-coming-8f5bcf4b2303",
  issueEto: `${neufundOrg}/issue`,
  commitmentStatus: "https://commit.neufund.org/commit/status?address=:walletAddress",
  icoMonitorEto: "https://icomonitor.io/#/:etoId",
  incomingPayoutBlogPost:
    "https://blog.neufund.org/neufund-101-how-to-accept-a-payout-from-neu-4de6eb4cc4a2",
  quintessenceLanding: "https://quintessence.global/",
  quintessenseTermsOfUse: "https://quintessence.global/assets/files/terms-of-use.pdf",
  ledgerSupport: "https://support.ledger.com/hc/en-us/articles/360002731113-Update-device-firmware",
  etherscanAddress,
  etherscanAddressReadContract: `${etherscanAddress}#readContract`,
  etherscanTransaction: "https://etherscan.io/tx/:txHash",
  imprint: "https://neufund.org/imprint",
  tos: "https://neufund.org/terms-of-use",
  privacyPolicy: "https://neufund.org/privacy-policy",
  ipfsDocument: "https://ipfs.io/ipfs/:ipfsHash",
  icoMonitorStats: "https://test.icomonitor.net/#/eto-stats/:etoId",
  accreditationHelp: "https://www.sec.gov/fast-answers/answers-accredhtm.html",
  accreditationHelpSecond:
    "https://www.ecfr.gov/cgi-bin/retrieveECFR?gp=&SID=8edfd12967d69c024485029d968ee737&r=SECTION&n=17y3.0.1.1.12.0.46.176",
  neufundCommunity: `${neufundOrg}/community`,
  metamaskSupportLink: "https://metamask.zendesk.com/hc/en-us",
  ledgerSupportLink: "https://support.ledger.com/hc/en-us",
  walletConnectLandingPage: "https://walletconnect.org/",
};
