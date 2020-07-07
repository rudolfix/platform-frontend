import { instantIdIdNowActions } from "./id-now/actions";
import { instantIdOnfidoActions } from "./onfido/actions";

export const instantIdActions = {
  ...instantIdIdNowActions,
  ...instantIdOnfidoActions,
};
