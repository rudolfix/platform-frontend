import { EUserType, IUser } from "../../lib/api/users/interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  setUser: (user: IUser) => createAction("AUTH_SET_USER", { user }),
  logout: (userType?: EUserType) => createAction("AUTH_LOGOUT", { userType }),
  verifyEmail: () => createSimpleAction("AUTH_VERIFY_EMAIL"),
  setCurrentAgreementHash: (currentAgreementHash: string) =>
    createAction("SET_CURRENT_AGREEMENT_HASH", { currentAgreementHash }),
  acceptCurrentAgreement: () => createSimpleAction("ACCEPT_CURRENT_AGREEMENT"),
  downloadCurrentAgreement: () => createSimpleAction("DOWNLOAD_CURRENT_AGREEMENT"),
};
