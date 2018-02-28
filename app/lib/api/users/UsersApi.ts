import { inject, injectable } from "inversify";

import { delay } from "bluebird";
import { symbols } from "../../../di/symbols";
import { ILogger } from "../../dependencies/Logger";
import { IHttpClient } from "../client/IHttpClient";
import { IUser, UserValidator, INewUser } from "./interfaces";

const USER_API_ROOT = "/api/user";

export class UserApiError extends Error {}
export class UserNotExisting extends UserApiError {}

@injectable()
export class UsersApi {
  constructor(
    @inject(symbols.authorizedHttpClient) private httpClient: IHttpClient,
    @inject(symbols.logger) private logger: ILogger,
  ) {}

  public async createAccount(newUser?: INewUser): Promise<IUser> {
    this.logger.info("Creating account for email: ", newUser && newUser.unverifiedEmail);

    const response = await this.httpClient.post<IUser>({
      baseUrl: USER_API_ROOT,
      url: "/user/",
      responseSchema: UserValidator,
      body: newUser,
    });

    return response.body;
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

    return response.body;
  }
}
