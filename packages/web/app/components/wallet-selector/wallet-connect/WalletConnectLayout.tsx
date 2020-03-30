import { Button, EButtonLayout } from "@neufund/design-system";
import * as React from "react";

import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";

type TErrorProps = {
  error: TMessage,
  walletConnectStart: () => void
}

export const WalletConnectError: React.FunctionComponent<TErrorProps> = ({ error, walletConnectStart }) =>
  <>
    <div>{getMessageTranslation(error)}</div>
    <Button
      layout={EButtonLayout.PRIMARY}
      type="button"
      onClick={walletConnectStart}
      data-test-id="eto-flow-start-bookbuilding"
    >
      retry
    </Button>
  </>;


export const WalletConnectContainer: React.FunctionComponent = ({ children }) =>
  <div className="justify-content-center text-center">
    {children}
  </div>;
