import { toEthereumChecksumAddress } from "@neufund/shared-utils";

import { bootstrapModule, createAndSignLightWalletWithKeyPair, createUser } from "../../../tests";
import { TLibSymbolType } from "../../../types";
import { createLibSymbol } from "../../../utils";
import { IEthManager, ISingleKeyStorage } from "../../core/module";
import { EUserType, EWalletSubType, EWalletType } from "../lib/users/interfaces";
import { authModuleAPI, setupAuthModule } from "../module";
import { loadOrCreateUser } from "./sagas";

export const BACKEND_BASE_URL = "https://platform.neufund.io";

describe("Auth - User - Integration Test", () => {
  describe("loadOrCreateUser", async function(): Promise<void> {
    // TODO timeout bad, replace with mocked services
    this.timeout(10000);

    const bootstrapAuthModule = async ({ shouldCreateUser }: { shouldCreateUser: boolean }) => {
      const jwtStorageSymbol = createLibSymbol<ISingleKeyStorage<string>>("jwtStorage");
      const ethManagerSymbol = createLibSymbol<IEthManager>("ethStorage");

      const getMockJwtStorage = (jwt: string) => ({
        get: () => Promise.resolve(jwt),
        set: () => {
          throw new Error("Not implemented");
        },
        clear: () => {
          throw new Error("Not implemented");
        },
      });

      const { expectSaga, container } = bootstrapModule(
        setupAuthModule({
          backendRootUrl: BACKEND_BASE_URL,
          jwtStorageSymbol,
          ethManagerSymbol,
          jwtTimingThreshold: 100,
          jwtRefreshThreshold: 100,
        }),
      );

      const { email, jwt, salt, address, privateKey } = await createAndSignLightWalletWithKeyPair(
        BACKEND_BASE_URL,
        [],
      );

      container
        .bind<TLibSymbolType<typeof jwtStorageSymbol>>(jwtStorageSymbol)
        .toConstantValue(getMockJwtStorage(jwt));

      const apiUserService = container.get<
        TLibSymbolType<typeof authModuleAPI.symbols.apiUserService>
      >(authModuleAPI.symbols.apiUserService);

      if (shouldCreateUser) {
        await createUser(EUserType.INVESTOR, privateKey, undefined, 10, BACKEND_BASE_URL);
      }

      return { expectSaga, salt, address, apiUserService, email, privateKey };
    };

    it("should create a new user with the correct data", async () => {
      const { expectSaga, salt, address, apiUserService } = await bootstrapAuthModule({
        shouldCreateUser: false,
      });

      const walletMetadata = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email: "mommyiloveyou@stu.com",
      };

      await expectSaga(loadOrCreateUser, { userType: EUserType.INVESTOR, walletMetadata })
        .not.call.fn(apiUserService.updateUser)
        .call(apiUserService.createAccount, {
          newEmail: walletMetadata.email,
          backupCodesVerified: false,
          salt,
          type: EUserType.INVESTOR,
          walletType: walletMetadata.walletType,
          walletSubtype: walletMetadata.walletSubType,
        })
        .put(
          authModuleAPI.actions.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            unverifiedEmail: walletMetadata.email,
            userId: toEthereumChecksumAddress(address),
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(false);
    });

    it("will not update the user with the correct data", async () => {
      const { expectSaga, salt, address, apiUserService, email } = await bootstrapAuthModule({
        shouldCreateUser: true,
      });

      const walletMetadata = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };

      await expectSaga(loadOrCreateUser, { userType: EUserType.INVESTOR, walletMetadata })
        .not.call.fn(apiUserService.createAccount)
        .not.call.fn(apiUserService.updateUser)
        .put(
          authModuleAPI.actions.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: walletMetadata.email,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(false);
    });

    it("will update the user wallet type", async () => {
      const { expectSaga, salt, address, apiUserService, email } = await bootstrapAuthModule({
        shouldCreateUser: true,
      });

      const walletMetadata = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };

      const currentUser = await apiUserService.me();

      await apiUserService.updateUser({
        ...currentUser,
        walletType: EWalletType.BROWSER,
        walletSubtype: EWalletSubType.METAMASK,
      });

      await expectSaga(loadOrCreateUser, { userType: EUserType.INVESTOR, walletMetadata })
        .not.call.fn(apiUserService.createAccount)
        .call(apiUserService.updateUser, {
          verifiedEmail: walletMetadata.email,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          type: EUserType.INVESTOR,
          walletType: walletMetadata.walletType,
          walletSubtype: walletMetadata.walletSubType,
          newEmail: undefined,
          salt: undefined,
        })
        .put(
          authModuleAPI.actions.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: walletMetadata.email,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(false);
    });

    it("should update the user with the correct data when a new email is entered on recovery", async () => {
      const { expectSaga, salt, address, apiUserService, email } = await bootstrapAuthModule({
        shouldCreateUser: true,
      });

      const walletMetadata = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };

      const newEmail = "mommy@love.com";

      await expectSaga(loadOrCreateUser, {
        userType: EUserType.INVESTOR,
        email: newEmail,
        salt,
        walletMetadata,
      })
        .not.call.fn(apiUserService.createAccount)
        .call(apiUserService.updateUser, {
          verifiedEmail: walletMetadata.email,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt,
          type: EUserType.INVESTOR,
          walletType: walletMetadata.walletType,
          walletSubtype: walletMetadata.walletSubType,
          newEmail,
        })
        .put(
          authModuleAPI.actions.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: walletMetadata.email,
            unverifiedEmail: newEmail,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(false);
    });

    it("will update the user when a new email is entered equals verified email", async () => {
      const { expectSaga, salt, address, apiUserService, email } = await bootstrapAuthModule({
        shouldCreateUser: true,
      });

      const walletMetadata = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };

      await expectSaga(loadOrCreateUser, {
        userType: EUserType.INVESTOR,
        email: walletMetadata.email,
        salt,
        walletMetadata,
      })
        .not.call.fn(apiUserService.createAccount)
        .call(apiUserService.updateUser, {
          verifiedEmail: walletMetadata.email,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt,
          type: EUserType.INVESTOR,
          walletType: walletMetadata.walletType,
          walletSubtype: walletMetadata.walletSubType,
          newEmail: walletMetadata.email,
        })
        .put(
          authModuleAPI.actions.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: walletMetadata.email,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(false);
    });

    it("will update the user when a new email is entered similar to unverified email", async () => {
      const { expectSaga, salt, address, apiUserService, email } = await bootstrapAuthModule({
        shouldCreateUser: true,
      });

      const newEmail = "mommy2@love.test";
      const walletMetadata = {
        walletType: EWalletType.LIGHT,
        walletSubType: EWalletSubType.UNKNOWN,
        salt,
        email,
      };

      const currentUser = await apiUserService.me();

      await apiUserService.updateUser({
        ...currentUser,
        newEmail,
        salt,
      });

      await expectSaga(loadOrCreateUser, {
        userType: EUserType.INVESTOR,
        email: newEmail,
        salt,
        walletMetadata,
      })
        .not.call.fn(apiUserService.createAccount)
        .call(apiUserService.updateUser, {
          verifiedEmail: email,
          unverifiedEmail: newEmail,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt,
          type: EUserType.INVESTOR,
          walletType: walletMetadata.walletType,
          walletSubtype: walletMetadata.walletSubType,
          newEmail: newEmail,
        })
        .put(
          authModuleAPI.actions.setUser({
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
        .run(false);

      // it should also cancel verification if same as verified email
      await expectSaga(loadOrCreateUser, {
        userType: EUserType.INVESTOR,
        email,
        salt,
        walletMetadata,
      })
        .not.call.fn(apiUserService.createAccount)
        .call(apiUserService.updateUser, {
          verifiedEmail: email,
          unverifiedEmail: newEmail,
          backupCodesVerified: false,
          language: "en",
          userId: address,
          latestAcceptedTosIpfs: "",
          salt,
          type: EUserType.INVESTOR,
          walletType: walletMetadata.walletType,
          walletSubtype: walletMetadata.walletSubType,
          newEmail: email,
        })
        .put(
          authModuleAPI.actions.setUser({
            backupCodesVerified: false,
            language: "en",
            latestAcceptedTosIpfs: "",
            type: EUserType.INVESTOR,
            verifiedEmail: email,
            userId: address,
            walletSubtype: EWalletSubType.UNKNOWN,
            walletType: EWalletType.LIGHT,
          }),
        )
        .run(false);
    });
  });
});
