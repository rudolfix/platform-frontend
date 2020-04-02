import { getContext } from "@neufund/sagas";
import { expectSaga, matchers } from "@neufund/sagas/tests";
import { toChecksumAddress } from "web3-utils";

import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../actions";
import { loadKycRequestData } from "../../kyc/sagas";
import { EWalletSubType, EWalletType } from "../../web3/types";
import { EthereumAddressWithChecksum } from "./../../../../../shared/src/utils/opaque-types/types";
import {
  BACKEND_BASE_URL,
  setTestJWT,
  setupIntegrationTestContainer,
} from "./../../../../test/sagaIntegrationTestHelpers";
import { createUser } from "./../../../test-e2e/utils/createUser";
import { loadOrCreateUser } from "./sagas";

describe("Auth - User - Integration Test", () => {
  describe("loadOrCreateUser", async function(): Promise<void> {
    this.timeout(5000);
    const { jwtStorage, apiUserService } = setupIntegrationTestContainer(BACKEND_BASE_URL);
    it("should create a new user with the correct data", async () => {
      const { jwt, salt, address } = await setTestJWT(BACKEND_BASE_URL, []);
      jwtStorage.set(jwt);

      const walletMetaData = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email: "mommyiloveyou@stu.com",
      };

      await expectSaga(
        loadOrCreateUser,
        {
          web3Manager: {
            personalWallet: {
              getMetadata: () => walletMetaData,
            } as any,
          },
          apiUserService,
        } as any,
        EUserType.INVESTOR,
      )
        .provide([
          [getContext("deps"), { apiUserService, jwtStorage }],
          [matchers.call.fn(loadKycRequestData), undefined],
        ])
        .call(apiUserService.createAccount, {
          newEmail: walletMetaData.email,
          backupCodesVerified: false,
          salt: salt,
          type: EUserType.INVESTOR,
          walletType: walletMetaData.walletType,
          walletSubtype: walletMetaData.walletSubType,
        })
        .put(
          actions.auth.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            unverifiedEmail: walletMetaData.email,
            userId: toChecksumAddress(address) as EthereumAddressWithChecksum,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(true as any);
    });

    it("should update the user with the correct data", async () => {
      const { email, jwt, salt, address, privateKey } = await setTestJWT(BACKEND_BASE_URL, []);
      await createUser(EUserType.INVESTOR, privateKey, undefined, 4, BACKEND_BASE_URL);

      const walletMetaData = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };
      jwtStorage.set(jwt);

      await expectSaga(
        loadOrCreateUser,
        {
          web3Manager: {
            personalWallet: {
              getMetadata: () => walletMetaData,
            } as any,
          },
          apiUserService,
        } as any,
        EUserType.INVESTOR,
      )
        .provide([
          [getContext("deps"), { apiUserService, jwtStorage }],
          [matchers.call.fn(loadKycRequestData), undefined],
        ])
        .call(apiUserService.updateUser, {
          verifiedEmail: walletMetaData.email,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt: salt,
          type: EUserType.INVESTOR,
          walletType: walletMetaData.walletType,
          walletSubtype: walletMetaData.walletSubType,
          newEmail: undefined,
        })
        .put(
          actions.auth.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: walletMetaData.email,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(true as any);
    });
    it("should update the user with the correct data when a new email is entered on recovery", async () => {
      const newEmail = "mommy@love.com";
      const { email, jwt, salt, address, privateKey } = await setTestJWT(BACKEND_BASE_URL, []);
      await createUser(EUserType.INVESTOR, privateKey, undefined, 4, BACKEND_BASE_URL);

      const walletMetaData = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };
      jwtStorage.set(jwt);

      await expectSaga(
        loadOrCreateUser,
        {
          web3Manager: {
            personalWallet: {
              getMetadata: () => walletMetaData,
            } as any,
          },
          apiUserService,
        } as any,
        EUserType.INVESTOR,
        newEmail,
      )
        .provide([
          [getContext("deps"), { apiUserService, jwtStorage }],
          [matchers.call.fn(loadKycRequestData), undefined],
        ])
        .call(apiUserService.updateUser, {
          verifiedEmail: walletMetaData.email,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt: salt,
          type: EUserType.INVESTOR,
          walletType: walletMetaData.walletType,
          walletSubtype: walletMetaData.walletSubType,
          newEmail,
        })
        .put(
          actions.auth.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: walletMetaData.email,
            unverifiedEmail: newEmail,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(true as any);
    });

    it("should update the user with the correct data when a new email is entered similar to verified email", async () => {
      const { email, jwt, salt, address, privateKey } = await setTestJWT(BACKEND_BASE_URL, []);
      await createUser(EUserType.INVESTOR, privateKey, undefined, 4, BACKEND_BASE_URL);

      const walletMetaData = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };
      jwtStorage.set(jwt);

      await expectSaga(
        loadOrCreateUser,
        {
          web3Manager: {
            personalWallet: {
              getMetadata: () => walletMetaData,
            } as any,
          },
          apiUserService,
        } as any,
        EUserType.INVESTOR,
        walletMetaData.email,
      )
        .provide([
          [getContext("deps"), { apiUserService, jwtStorage }],
          [matchers.call.fn(loadKycRequestData), undefined],
        ])
        .call(apiUserService.updateUser, {
          verifiedEmail: walletMetaData.email,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt: salt,
          type: EUserType.INVESTOR,
          walletType: walletMetaData.walletType,
          walletSubtype: walletMetaData.walletSubType,
          newEmail: undefined,
        })
        .put(
          actions.auth.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: walletMetaData.email,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(true as any);
    });

    it("should update the user with the correct data when a new email is entered similar to unverified email", async () => {
      const { email, jwt, salt, address, privateKey } = await setTestJWT(BACKEND_BASE_URL, []);
      await createUser(EUserType.INVESTOR, privateKey, undefined, 4, BACKEND_BASE_URL);

      const newEmail = "mommy2@love.test";

      const walletMetaData = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };
      jwtStorage.set(jwt);

      const currentUser = await apiUserService.me();

      await apiUserService.updateUser({
        ...currentUser,
        newEmail,
        salt,
      });

      await expectSaga(
        loadOrCreateUser,
        {
          web3Manager: {
            personalWallet: {
              getMetadata: () => walletMetaData,
            } as any,
          },
          apiUserService,
        } as any,
        EUserType.INVESTOR,
        newEmail,
      )
        .provide([
          [getContext("deps"), { apiUserService, jwtStorage }],
          [matchers.call.fn(loadKycRequestData), undefined],
        ])
        .call(apiUserService.updateUser, {
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt: salt,
          type: EUserType.INVESTOR,
          walletType: walletMetaData.walletType,
          walletSubtype: walletMetaData.walletSubType,
          verifiedEmail: email,
          unverifiedEmail: newEmail,
          newEmail: undefined,
        })
        .put(
          actions.auth.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: email,
            unverifiedEmail: newEmail,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(true as any);
    });
  });
});
