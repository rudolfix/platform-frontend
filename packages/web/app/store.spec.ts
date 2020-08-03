import { expect } from "chai";

import { staticValues } from "./store";

describe("Store", () => {
  describe("staticValues", () => {
    // State taken from Redux-Tools
    const stateDuringLogin = {
      jwt: {},
      user: {},
      tokenPrice: {
        loading: false,
        tokenPriceData: {
          etherPriceEur: "194.75040211930542",
          neuPriceEur: "0.12927645111157302",
          eurPriceEther: "0.00513477758771144",
          priceOutdated: false,
        },
      },
      txUserFlowTransfer: {
        txUserTokenData: {
          tokenAddress: "",
          userBalance: "0",
          tokenSymbol: "",
          tokenImage: "",
          tokenDecimals: 0,
        },
        txUserFlowInputData: { to: "", value: "" },
        txUserFlowDetails: {
          inputValue: "0",
          inputValueEuro: "0",
          inputTo: "",
          totalValue: "0",
          totalValueEur: "0",
          transactionCost: "0",
          transactionCostEur: "0",
        },
      },
      txUserFlowRedeem: {},
      txValidator: { notifications: [] },
      txSender: { state: "UNINITIALIZED" },
      txMonitor: { txs: { oooTransactions: [] } },
      bankTransferFLow: {
        state: "uninitialized",
        minEuro: "",
        reference: "",
        bankFee: "",
      },
      contracts: {
        platformTermsConstants: {
          IS_ICBM_INVESTOR_WHITELISTED: true,
          PLATFORM_NEUMARK_SHARE: "2",
          TOKEN_PARTICIPATION_FEE_FRACTION: "20000000000000000",
          PLATFORM_FEE_FRACTION: "30000000000000000",
          TOKEN_RATE_EXPIRES_AFTER: "14400",
        },
      },
      ledgerWizardState: {
        isInitialConnectionInProgress: true,
        isConnectionEstablished: false,
        isLoading: false,
        derivationPathPrefix: "44'/60'/0'/0",
        index: 0,
        numberOfAccountsPerPage: 10,
        accounts: [],
        advanced: false,
      },
      verifyEmailWidgetState: { isButtonLocked: false },
      browserWalletWizardState: { isLoading: false, approvalRejected: false },
      web3: {
        connected: false,
        web3Available: false,
        previousConnectedWallet: {
          address: "0xf7ee44f599BD9d609caaB0b2868FACF0D2eC08D1",
          walletType: "BROWSER",
          walletSubType: "METAMASK",
          userType: "investor",
        },
      },
      browser: { name: "chrome", version: "81.0.4044" },
      walletSelector: {
        isMessageSigning: false,
        isLoading: false,
        walletType: "BROWSER",
        uiState: "registrationForm",
        flowType: "register",
        showWalletSelector: true,
        rootPath: "/register",
        initialFormValues: { email: "", tos: false },
      },
      auth: { status: "non-authorized" },
      genericModal: { isOpen: false },
      accessWallet: { isModalOpen: false },
      kyc: {
        onfido: {},
        idNow: {},
        statusLoading: false,
        individualDataLoading: false,
        individualFilesLoading: false,
        individualFilesUploadingCount: 0,
        individualFiles: [],
        businessDataLoading: false,
        businessFilesLoading: false,
        businessFilesUploadingCount: 0,
        businessFiles: [],
        managingDirectorLoading: false,
        managingDirectorFilesLoading: false,
        managingDirectorFilesUploadingCount: 0,
        managingDirectorFiles: [],
        showManagingDirectorModal: false,
        legalRepresentativeLoading: false,
        legalRepresentativeFilesLoading: false,
        legalRepresentativeFilesUploadingCount: 0,
        legalRepresentativeFiles: [],
        showLegalRepresentativeModal: false,
        loadingBeneficialOwners: false,
        loadingBeneficialOwner: false,
        beneficialOwners: [],
        beneficialOwnerFiles: {},
        beneficialOwnerFilesLoading: {},
        beneficialOwnerFilesUploadingCount: {},
        showBeneficialOwnerModal: false,
      },
      profile: { isEmailTemporaryCancelled: false },
      investorPortfolio: {
        calculatedContributions: {},
        initialCalculatedContributions: {},
        investorEtoTickets: {},
        tokensDisbursal: { loading: false, error: false },
        incomingPayouts: { loading: false, error: false },
        tokensPersonalDiscounts: {},
      },
      init: {
        appInit: { inProgress: false, done: true },
        smartcontractsInit: { inProgress: false, done: true },
      },
      lightWalletWizard: { isLoading: false, recoveryPhase: 1 },
      walletConnect: {},
      wallet: { loading: true },
      txHistory: { status: 1 },
      notifications: { notifications: [] },
      etoIssuer: {
        loading: false,
        saving: false,
        bookbuildingStats: [],
        etoDateSaving: false,
      },
      bookBuildingFlow: { bookbuildingStats: {}, pledges: {} },
      etoDocuments: {
        loading: false,
        saving: false,
        etoFilesInfo: { productTemplates: {} },
        showIpfsModal: false,
        uploading: {},
        downloading: {},
      },
      etoNominee: { isLoading: false, nomineeRequests: {} },
      eto: {
        etos: {},
        etosError: false,
        companies: {},
        contracts: {},
        maxCapExceeded: {},
        tokenData: {},
        tokenGeneralDiscounts: {},
        offeringAgreementsStatus: {},
        signedInvestmentAgreements: {},
        tokensLoading: false,
      },
      etoView: { processState: "notStarted" },
      depositEthModal: { isOpen: false },
      icbmWalletBalanceModal: {
        isOpen: false,
        loading: false,
        isMigrating: false,
        firstTransactionDone: false,
        secondTransactionDone: false,
        currentMigrationStep: 1,
      },
      gas: { loading: false },
      investmentFlow: {
        etoId: "",
        euroValue: "",
        ethValueUlps: "",
        investmentType: "ETH",
        wallets: [],
        isValidatedInput: false,
      },
      videoModal: { isOpen: false },
      personProfileModal: { isOpen: false },
      portfolioDownloadAgreementsModal: { isOpen: false },
      immutableStorage: { pendingDownloads: {} },
      nomineeFlow: {
        ready: false,
        loading: false,
        error: "none",
        activeNomineeTask: "noTasks",
        nomineeTasksData: {
          noTasks: {},
          accountSetup: {},
          linkToIssuer: [{}],
          linkBankAccount: {},
          byPreviewCode: {},
        },
        nomineeRequests: {},
        nomineeEtos: {},
        nomineeEtosAdditionalData: {},
        nomineeTasksStatus: {
          noTasks: "not_done",
          accountSetup: "not_done",
          linkToIssuer: "not_done",
          linkBankAccount: "not_done",
          byPreviewCode: {},
        },
      },
      fullPageLoading: { isOpen: false },
      routing: { hasRedirectedToBrowserAlready: true },
      router: {
        location: {
          pathname: "/register/browser",
          search: "",
          hash: "",
          key: "3u1vi7",
        },
        action: "POP",
      },
    };

    it("keeps correct state when staticValues is called", async () => {
      const staticState = {
        router: {
          location: {
            pathname: "/register/browser",
            search: "",
            hash: "",
            key: "3u1vi7",
          },
          action: "POP",
        },
        contracts: {
          platformTermsConstants: {
            IS_ICBM_INVESTOR_WHITELISTED: true,
            PLATFORM_NEUMARK_SHARE: "2",
            TOKEN_PARTICIPATION_FEE_FRACTION: "20000000000000000",
            PLATFORM_FEE_FRACTION: "30000000000000000",
            TOKEN_RATE_EXPIRES_AFTER: "14400",
          },
        },
        walletSelector: {
          isMessageSigning: false,
          isLoading: false,
          walletType: "BROWSER",
          uiState: "registrationForm",
          flowType: "register",
          showWalletSelector: true,
          rootPath: "/register",
          initialFormValues: { email: "", tos: false },
        },
        init: {
          appInit: { inProgress: false, done: true },
          smartcontractsInit: { inProgress: false, done: true },
        },
        web3: {
          connected: false,
          web3Available: false,
          previousConnectedWallet: {
            address: "0xf7ee44f599BD9d609caaB0b2868FACF0D2eC08D1",
            walletType: "BROWSER",
            walletSubType: "METAMASK",
            userType: "investor",
          },
        },
        browser: { name: "chrome", version: "81.0.4044" },
      };

      expect(JSON.stringify(staticValues(stateDuringLogin as any))).to.equal(
        JSON.stringify(staticState),
      );
    });
  });
});
