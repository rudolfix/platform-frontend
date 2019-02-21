import * as React from "react";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { onEnterAction } from "../../utils/OnEnterAction";
import { Dashboard } from "../dashboard/Dashboard";

export const UnlockWalletFundsFromLinkComponent: React.FunctionComponent<void> = () => (
  <Dashboard />
);

export const UnlockWalletFundsFromLink = compose<React.FunctionComponent>(
  onEnterAction({ actionCreator: d => d(actions.txTransactions.startUnlockEtherFunds()) }),
)(UnlockWalletFundsFromLinkComponent);
