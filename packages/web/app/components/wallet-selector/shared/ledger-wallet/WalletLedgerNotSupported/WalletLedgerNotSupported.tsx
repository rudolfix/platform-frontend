import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ExternalLink } from "../../../../shared/links";

export const WalletLedgerNotSupported: React.FunctionComponent = () => (
  <div className="mx-md-5">
    <p className="mx-n4">
      <FormattedMessage
        values={{
          chromeDownloadLink: (
            <ExternalLink href={"https://www.google.pl/chrome/"}>Chrome </ExternalLink>
          ),
        }}
        id="wallet-selector.ledger-not-supported"
      />
    </p>
  </div>
);
