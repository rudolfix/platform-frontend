import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import {
  selectLightWalletEmailFromQueryString,
  selectPreviousLightWalletEmail,
} from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { LoginWithEmailLightWallet } from "./LoginWithEmailLightWallet";
import { MissingEmailLightWallet } from "./MissingEmailLightWallet";

interface IStateProps {
  email?: string;
}

export const LoginLightWalletComponent: React.SFC<IStateProps> = ({ email }) => (
  <>
    <h2 className="text-center mb-4" data-test-id="modals.wallet-selector.login-light-wallet.title">
      <FormattedMessage id="wallet-selector.neuwallet.welcome" />
    </h2>

    {email ? <LoginWithEmailLightWallet email={email} /> : <MissingEmailLightWallet />}
  </>
);

export const LoginLightWallet = appConnect<IStateProps>({
  stateToProps: s => ({
    email:
      selectLightWalletEmailFromQueryString(s.router) || selectPreviousLightWalletEmail(s.web3),
  }),
})(LoginLightWalletComponent);
