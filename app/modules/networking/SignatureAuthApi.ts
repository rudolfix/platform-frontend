import { inject, injectable } from "inversify";
import * as Yup from "yup";

import { EthereumAddressWithChecksum } from "../../types";
import { SignerType } from "../web3/PersonalWeb3";
import { IHttpClient, IHttpResponse } from "./IHttpClient";
import { JSON_HTTP_CLIENT_SYMBOL } from "./JsonHttpClient";

export interface IChallengeEndpointResponse {
  challenge: string;
}

export interface ICreateJwtEndpointResponse {
  jwt: string;
}

export const SIGNATURE_AUTH_API_SYMBOL = Symbol();

@injectable()
export class SignatureAuthApi {
  constructor(@inject(JSON_HTTP_CLIENT_SYMBOL) private httpClient: IHttpClient) {}

  public async challenge(
    address: EthereumAddressWithChecksum,
    salt: string,
    signerType: SignerType,
  ): Promise<IHttpResponse<IChallengeEndpointResponse>> {
    return await this.httpClient.post<IChallengeEndpointResponse>({
      baseUrl: "/api/signature/",
      url: "/jwt/challenge",
      responseSchema: Yup.object().shape({
        challenge: Yup.string,
      }),
      body: {
        address,
        salt,
        signer_type: signerType,
      },
    });
  }

  public async createJwt(
    challenge: string,
    signedChallenge: string,
    signerType: SignerType,
  ): Promise<IHttpResponse<ICreateJwtEndpointResponse>> {
    return await this.httpClient.post<ICreateJwtEndpointResponse>({
      baseUrl: "/api/signature/",
      url: "/jwt/create",
      responseSchema: Yup.object().shape({
        jwt: Yup.string,
      }),
      body: {
        challenge,
        response: signedChallenge,
        signer_type: signerType,
      },
    });
  }
}
