import { expect } from "chai";
import { spy } from "sinon";
import { obtainJwt } from "../../../app/modules/networking/jwt-actions";
import { SignatureAuthApi } from "../../../app/modules/networking/SignatureAuthApi";
import { BrowserWallet } from "../../../app/modules/web3/BrowserWallet";
import { SignerType, WalletSubType, WalletType } from "../../../app/modules/web3/PersonalWeb3";
import { Web3Manager } from "../../../app/modules/web3/Web3Manager";
import { IAppState } from "../../../app/store";
import {
  dummyEthereumAddress,
  dummyEthereumAddressWithChecksum,
  dummyLogger,
} from "../../fixtures";
import { createMock } from "../../testUtils";

describe("Jwt actions", () => {
  describe("obtain-jwt", () => {
    it("should obtain jwt", async () => {
      const expectedSalt = "some not really random salt";
      const expectedChallenge = "backend challenge";
      const expectedSignedMessage = "signed message";
      const expectedJwt = "jwt";
      const expectedSignerType = SignerType.ETH_SIGN_TYPED_DATA;

      const mockedState: Partial<IAppState> = {
        web3State: {
          connected: true,
          ethereumAddress: dummyEthereumAddress,
          type: WalletType.BROWSER,
          subtype: WalletSubType.UNKNOWN,
        },
      };

      const browserWalletMock = createMock(BrowserWallet, {
        signMessage: async () => expectedSignedMessage,
        signerType: expectedSignerType,
      });
      const web3ManagerMock = createMock(Web3Manager, {
        personalWallet: browserWalletMock,
      });
      const getStateMock = spy(() => mockedState);
      const signatureAuthApiMock = createMock(SignatureAuthApi, {
        challenge: async () => ({ statusCode: 200, body: { challenge: expectedChallenge } }),
        createJwt: async () => ({ statusCode: 200, body: { jwt: expectedJwt } }),
      });
      const randomStringMock = spy(() => expectedSalt);

      await obtainJwt(
        web3ManagerMock,
        getStateMock,
        signatureAuthApiMock,
        randomStringMock,
        dummyLogger,
      );

      expect(randomStringMock).to.be.calledWithExactly(64);
      expect(signatureAuthApiMock.challenge).to.be.calledWithExactly(
        dummyEthereumAddressWithChecksum,
        expectedSalt,
        expectedSignerType,
      );
      expect(browserWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
      expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
        expectedChallenge,
        expectedSignedMessage,
        expectedSignerType,
      );
    });
  });
});
