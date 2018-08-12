import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { WalletSubType, WalletType } from "../../../modules/web3/types";
import { ILogger } from "../../dependencies/Logger";
import { IHttpClient } from "../client/IHttpClient";
import {
  emailStatus,
  IEmailStatus,
  IUser,
  IUserInput,
  IVerifyEmailUser,
  TxWithMetadata,
  TxWithMetadataListValidator,
  UserValidator,
} from "./interfaces";

const USER_API_ROOT = "/api/user";

export class UserApiError extends Error {}
export class UserNotExisting extends UserApiError {}
export class EmailAlreadyExists extends UserApiError {}

const upperCaseWalletTypesInUser = (userApiResponse: IUser): IUser => ({
  ...userApiResponse,
  walletType:
    (userApiResponse.walletType && (userApiResponse.walletType.toUpperCase() as WalletType)) ||
    undefined,
  walletSubtype:
    (userApiResponse.walletType &&
      (userApiResponse.walletSubtype.toUpperCase() as WalletSubType)) ||
    undefined,
});

@injectable()
export class UsersApi {
  constructor(
    @inject(symbols.authorizedHttpClient) private httpClient: IHttpClient,
    @inject(symbols.logger) private logger: ILogger,
  ) {}

  public async createAccount(newUser?: IUserInput): Promise<IUser> {
    this.logger.info("Creating account for email: ", newUser && newUser.newEmail);
    // Backend expects walletType and walletSubType values as lower case
    const modifiedNewUser = newUser
      ? {
          ...newUser,
          walletType: newUser.walletType.toLowerCase(),
          walletSubtype: newUser.walletSubtype ? newUser.walletSubtype.toLowerCase() : undefined,
        }
      : {};
    const response = await this.httpClient.post<IUser>({
      baseUrl: USER_API_ROOT,
      url: "/user/",
      responseSchema: UserValidator,
      body: modifiedNewUser,
      allowedStatusCodes: [409],
    });
    if (response.statusCode === 409) {
      throw new EmailAlreadyExists();
    }
    return upperCaseWalletTypesInUser(response.body);
  }

  public async me(): Promise<IUser> {
    const response = await this.httpClient.get<IUser>({
      baseUrl: USER_API_ROOT,
      url: "/user/me",
      responseSchema: UserValidator,
      allowedStatusCodes: [404],
    });

    if (response.statusCode === 404) {
      throw new UserNotExisting();
    }
    return upperCaseWalletTypesInUser(response.body);
  }

  public async emailStatus(userEmail: string): Promise<any> {
    const response = await this.httpClient.get<IEmailStatus>({
      baseUrl: USER_API_ROOT,
      url: `/email/status/${userEmail}`,
      responseSchema: emailStatus,
    });
    return response.body;
  }

  public async verifyUserEmail(userCode: IVerifyEmailUser): Promise<IUser> {
    const response = await this.httpClient.put<IUser>({
      baseUrl: USER_API_ROOT,
      url: "/user/me/email-verification",
      responseSchema: UserValidator,
      allowedStatusCodes: [404, 409],
      body: userCode,
    });

    if (response.statusCode === 404) {
      throw new UserNotExisting();
    }
    if (response.statusCode === 409) {
      throw new EmailAlreadyExists();
    }

    return upperCaseWalletTypesInUser(response.body);
  }

  public async updateUser(updatedUser: IUserInput): Promise<IUser> {
    const modifiedUpdatedUser = updatedUser
      ? {
          ...updatedUser,
          walletType: updatedUser.walletType.toLocaleLowerCase(),
          walletSubtype: updatedUser.walletSubtype
            ? updatedUser.walletSubtype.toLocaleLowerCase()
            : undefined,
        }
      : {};
    const response = await this.httpClient.put<IUser>({
      baseUrl: USER_API_ROOT,
      url: "/user/me",
      responseSchema: UserValidator,
      allowedStatusCodes: [404, 409],
      body: modifiedUpdatedUser,
    });

    if (response.statusCode === 404) {
      throw new UserNotExisting();
    }
    if (response.statusCode === 409) {
      throw new EmailAlreadyExists();
    }

    return upperCaseWalletTypesInUser(response.body);
  }

  public async pendingTxs(): Promise<Array<TxWithMetadata>> {
    const response = await this.httpClient.get<Array<TxWithMetadata>>({
      baseUrl: USER_API_ROOT,
      url: "/pending_transactions/me",
      responseSchema: TxWithMetadataListValidator,
    });

    return response.body;
  }
}
