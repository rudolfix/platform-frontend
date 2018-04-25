import * as React from "react";
import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";

interface IStateProps {
  isLoginRoute: boolean;
}

export const LedgerHeaderComponent: React.SFC<IStateProps> = ({ isLoginRoute }) => (
  <h1 className="text-center">
    {isLoginRoute ? "Log in with Nano Ledger" : "Register your Nano Ledger"}
  </h1>
);

export const LedgerHeader = appConnect({
  stateToProps: s => ({
    isLoginRoute: selectIsLoginRoute(s.router),
  }),
})(LedgerHeaderComponent);
