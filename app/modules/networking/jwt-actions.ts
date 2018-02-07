import { GetState, GetStateSymbol } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { CryptoRandomString, CryptoRandomStringSymbol } from "../../utils/cryptoRandomString";
import { ILogger, LoggerSymbol } from "../../utils/Logger";
import { selectEthereumAddressWithChecksum } from "../web3/reducer";
import { Web3Manager, Web3ManagerSymbol } from "../web3/Web3Manager";
import { SignatureAuthApi, SignatureAuthApiSymbol } from "./SignatureAuthApi";

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

    logger.info("Obtaining auth challenge from api");
    const { body: { challenge } } = await signatureAuthApi.challenge(address, salt);

    logger.info("Signing challenge");
    const signedChallenge = await web3Manager.personalWallet!.signMessage(challenge);

    logger.info("Sending signed challenge back to api");
    const { body: { jwt } } = await signatureAuthApi.createJwt(challenge, signedChallenge);
    logger.debug("JWT: ", jwt);
  },
  [
    Web3ManagerSymbol,
    GetStateSymbol,
    SignatureAuthApiSymbol,
    CryptoRandomStringSymbol,
    LoggerSymbol,
  ],
);
