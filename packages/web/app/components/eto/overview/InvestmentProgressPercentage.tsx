import { Percentage } from "@neufund/design-system";
import { etoModuleApi, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import { nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

const InvestmentProgressPercentage: React.FunctionComponent<TExternalProps> = ({ eto }) => {
  const currentInvestmentProgressPercentage = nonNullable(
    etoModuleApi.utils.getInvestmentCalculatedPercentage(eto),
  );
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
