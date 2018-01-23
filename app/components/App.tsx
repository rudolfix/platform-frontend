import * as React from "react";
import { Route } from "react-router-dom";

import { Dashboard } from "./Dashboard";
import { Header } from "./Header";
import { Home } from "./Home";
import { Kyc } from "./Kyc";
import { Success } from "./Success";
import { WalletSelector } from "./walletSelector/WalletSelector";

export const App = () => (
  <div>
    <Header isAuthorized={true} name={"Marcin Rodulfix"} balanceEuro={0} balanceNeu={0} />
    <Route path="/" component={Home} exact />
    <Route path="/walletselector" component={WalletSelector} exact />
    <Route path="/kyc" component={Kyc} exact />
    <Route path="/dashboard" component={Dashboard} exact />
    <Route path="/success" component={Success} exact />
  </div>
);
