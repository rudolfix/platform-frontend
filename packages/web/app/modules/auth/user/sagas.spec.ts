import { toChecksumAddress } from "web3-utils";
import { EthereumAddressWithChecksum } from "./../../../../../shared/src/utils/opaque-types/types";
import { EthereumAddress } from "@neufund/shared";
import { Logger } from "@neufund/shared-modules/src/modules/core/lib/logger";
import { NODE_ADDRESS } from "./../../../test-e2e/config";
import { generateRandomPrivateKey } from "./../../../test-e2e/utils/e2eWeb3Utils";
import { remove0x } from "./../../web3/utils";
import { PrivateKeyProvider } from "truffle-privatekey-provider";
import { createUserT } from "../../../test-e2e/utils/userHelpers";
import { getContext } from "@neufund/sagas";
import { expectSaga, matchers } from "@neufund/sagas/tests";
import { Container } from "inversify";

import { symbols } from "../../../di/symbols";
import { IBackendRoot } from "../../../config/getConfig";
import { AuthorizedJsonHttpClient } from "../../../lib/api/client/AuthJsonHttpClient";
import { IHttpClient } from "../../../lib/api/client/IHttpClient";
import { JsonHttpClient } from "../../../lib/api/client/JsonHttpClient";
import { UsersApi } from "../../../lib/api/users/UsersApi";
import { STORAGE_JWT_KEY } from "../../../lib/persistence/JwtObjectStorage";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import { Storage } from "../../../lib/persistence/Storage";
import { loadOrCreateUser } from "./sagas";
import { EUserType } from "../../../lib/api/users/interfaces";
import { loadKycRequestData } from "../../kyc/sagas";
import { actions } from "../../actions";
import { EWalletType, EWalletSubType } from "../../web3/types";

describe("Auth - User", () => {
  const myContainer = new Container();
  myContainer
    .bind<IHttpClient>(symbols.jsonHttpClient)
    .to(JsonHttpClient)
    .inSingletonScope();

  myContainer
    .bind<IHttpClient>(symbols.authorizedJsonHttpClient)
    .to(AuthorizedJsonHttpClient)
    .inSingletonScope();

  myContainer
    .bind<ObjectStorage<string>>(symbols.jwtStorage)
    .toDynamicValue(
      ctx =>
        new ObjectStorage<string>(
          ctx.container.get(symbols.storage),
          ctx.container.get(symbols.logger),
          STORAGE_JWT_KEY,
        ),
    )
    .inSingletonScope();

  myContainer.bind<Storage>(symbols.storage).toConstantValue(new Storage({} as any));

  myContainer
    .bind<UsersApi>(symbols.usersApi)
    .to(UsersApi)
    .inSingletonScope();

  myContainer
    .bind<any>(symbols.logger)
    .to(Logger)
    .inSingletonScope();

  myContainer
    .bind<IBackendRoot>(symbols.backendRootConfig)
    .toConstantValue({ url: "https://platform.neufund.io" });

  const apiUserService = myContainer.get<UsersApi>(symbols.usersApi);

  const jwtStorage = myContainer.get<ObjectStorage<string>>(symbols.jwtStorage);

  describe.only("loadOrCreateUser", () => {
    it("should yield the import wallet flow", async function(): Promise<void> {
      this.timeout(5000);

      const crypto = require("crypto");

      global.crypto = { getRandomValues: crypto.randomBytes };
      global.fetch = require("node-fetch");
      global.cy = { log: () => {} };

      const { jwt, salt, address } = await createUserT("https://platform.neufund.io", []);

      const walletMetaData = {
        walletType: "LIGHT",
        walletSubType: "UNKNOWN",
        salt,
        email: "mommyiloveyou@stu.com",
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
        .run(true);
    });
  });
});
