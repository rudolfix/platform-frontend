import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { SectionHeader } from "../shared/SectionHeader";

const ICBMWalletHelpTextModal: React.FunctionComponent = () => {
  return (
    <section data-test-id="wallet-selector-icbm-wallet-help-text-modal">
      <SectionHeader className="mb-4">
        <FormattedMessage id="icbm-help-modal.title" />
      </SectionHeader>

      <p className="mb-0">
        <FormattedHTMLMessage tagName="span" id="icbm-help-modal.paragraph" />
      </p>
    </section>
  );
};

export { ICBMWalletHelpTextModal };
