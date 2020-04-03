import React from "react";

import { AppRouter } from "./AppRouter";
import { SignerModal } from "./components/signer/SignerModal";
import { AppContainer } from "./components/containers/AppContainer";

const App: React.FunctionComponent = () => (
  <AppContainer>
    <AppRouter />

    <SignerModal />
  </AppContainer>
);

export { App };
