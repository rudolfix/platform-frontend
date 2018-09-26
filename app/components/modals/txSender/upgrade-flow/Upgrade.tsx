import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { onEnterAction } from "../../../../utils/OnEnterAction";

const UpgradeComponent: React.SFC<{}> = () => <div />;

export const Upgrade = compose<any>(props => {
  debugger;
  return onEnterAction({
    actionCreator: d => d(actions.wallet.upgradeWalletEuroToken()),
  });
})(UpgradeComponent);
