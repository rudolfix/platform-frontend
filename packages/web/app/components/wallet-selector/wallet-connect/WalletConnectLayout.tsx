import * as React from "react";
import { Button, EButtonLayout } from "@neufund/design-system";

import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";


interface IExternalProps {
  error: TMessage | undefined,
  walletConnectStart: () => void
}

interface IErrorProps {
  error: TMessage,
  walletConnectStart: () => void
}

export const WalletConnectError: React.FunctionComponent<IErrorProps> = ({ error, walletConnectStart }) =>
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

export const WalletConnectLayout: React.FunctionComponent<IExternalProps> = ({
  error,
  walletConnectStart
}) =>
  <>
    <div className="justify-content-center text-center">
      {error
        ? <WalletConnectError error={error} walletConnectStart={walletConnectStart} />
        : <LoadingIndicator />
      }
    </div>
  </>;

