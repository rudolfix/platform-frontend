import React from "react";

import { AppRouter } from "./AppRouter";
import { SignerModal } from "./components/signer/SignerModal";

const App: React.FunctionComponent = () => (
  <>
    <AppRouter />

    <SignerModal />
  </>
);

export { App };
