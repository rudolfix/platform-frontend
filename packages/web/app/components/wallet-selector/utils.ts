import { EUserType } from "../../lib/api/users/interfaces";

export const userMayChooseWallet = (userType: EUserType) =>
  userType !== EUserType.NOMINEE &&
  !(userType === EUserType.ISSUER && process.env.NF_ISSUERS_CAN_LOGIN_WITH_ANY_WALLET !== "1");
