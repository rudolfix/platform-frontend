import { Percentage } from "@neufund/design-system";
import { nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { getInvestmentCalculatedPercentage } from "../../../modules/eto/utils";

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

const InvestmentProgressPercentage: React.FunctionComponent<TExternalProps> = ({ eto }) => {
  const currentInvestmentProgressPercentage = nonNullable(getInvestmentCalculatedPercentage(eto));
  return (
    <FormattedMessage
      id="shared-component.eto-overview.investment-stats.funded-percentage"
      values={{
        funded: (
          <Percentage
            data-test-id="investment-widget-funded-percentage"
            value={currentInvestmentProgressPercentage}
          />
        ),
      }}
    />
  );
};

export { InvestmentProgressPercentage };
