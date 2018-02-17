import { GetState } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { symbols } from "../../symbols";
import { CryptoRandomString } from "../../utils/cryptoRandomString";
import { ILogger } from "../../utils/Logger";
import { selectEthereumAddressWithChecksum } from "../web3/reducer";
import { Web3Manager } from "../web3/Web3Manager";
import { SignatureAuthApi } from "./SignatureAuthApi";

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
    symbols.web3Manager,
    symbols.getState,
    symbols.signatureAuthApi,
    symbols.cryptoRandomString,
    symbols.logger,
  ],
);
