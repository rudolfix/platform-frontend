import { EETOStateOnChain } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { generalStateToName } from "../../../../shared/eto-state/ETOState";

type TExternalProps = { nextState: EETOStateOnChain };

const StartDateNotSet: React.FunctionComponent<TExternalProps> = ({ nextState }) => {
  const stateName = generalStateToName[nextState];

  return (
    <p className="text-center m-0" data-test-id="eto-start-date-not-set">
      <FormattedMessage
        id="shared-component.eto-overview.waiting-for-start-date-to-set"
        values={{ stateName }}
      />
    </p>
  );
};

export { StartDateNotSet };
