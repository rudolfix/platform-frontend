import { GET_STATE_SYMBOL, GetState } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { CRYPTO_RANDOM_STRING_SYMBOL, CryptoRandomString } from "../../utils/cryptoRandomString";
import { ILogger, LOGGER_SYMBOL } from "../../utils/Logger";
import { selectEthereumAddressWithChecksum } from "../web3/reducer";
import { WEB3_MANAGER_SYMBOL, Web3Manager } from "../web3/Web3Manager";
import { SIGNATURE_AUTH_API_SYMBOL, SignatureAuthApi } from "./SignatureAuthApi";

export const obtainJwt = injectableFn(
  async (
    web3Manager: Web3Manager,
    getState: GetState,
    signatureAuthApi: SignatureAuthApi,
    cryptoRandomString: CryptoRandomString,
    logger: ILogger,
  ) => {
    const address = selectEthereumAddressWithChecksum(getState().web3State);

    const salt = cryptoRandomString(64);

    const signerType = web3Manager.personalWallet!.signerType;

    logger.info("Obtaining auth challenge from api");
    const { body: { challenge } } = await signatureAuthApi.challenge(address, salt, signerType);

    logger.info("Signing challenge");
    const signedChallenge = await web3Manager.personalWallet!.signMessage(challenge);

    logger.info("Sending signed challenge back to api");
    const { body: { jwt } } = await signatureAuthApi.createJwt(
      challenge,
      signedChallenge,
      signerType,
    );
    logger.info("JWT obtained!", jwt); // get rid of printing jwt in near future
  },
  [
    WEB3_MANAGER_SYMBOL,
    GET_STATE_SYMBOL,
    SIGNATURE_AUTH_API_SYMBOL,
    CRYPTO_RANDOM_STRING_SYMBOL,
    LOGGER_SYMBOL,
  ],
);
