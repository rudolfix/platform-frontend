import { createActionFactory } from "@neufund/shared-utils";

export const txUserFlowRedeemActions = {
  setInitialValue: createActionFactory(
    "TX_USER_FLOW_REDEEM_SET_INITIAL_VALUE",
    (initialValue: string | undefined) => ({ initialValue }),
  ),
};
