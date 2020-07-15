import { WholeEur } from "@neufund/design-system";
import { etoModuleApi, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import { nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ECustomTooltipTextPosition, Tooltip } from "../../../../shared/tooltips";

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

const InvestmentTarget: React.FunctionComponent<TExternalProps> = ({ eto }) => {
  const target = etoModuleApi.utils.getEtoEurMinTarget(eto);
  const { investmentCalculatedValues } = eto;
  const { minInvestmentAmount } = nonNullable(investmentCalculatedValues);

  return (
    <>
      <span>
        <FormattedMessage
          id="shared-component.eto-overview.investment-stats.target"
          values={{
            amountRaised: (
              <WholeEur
                data-test-id="investment-widget-nEur-target"
                value={target ? target : minInvestmentAmount.toString()}
              />
            ),
          }}
        />
        {target && (
          <Tooltip
            textPosition={ECustomTooltipTextPosition.LEFT}
            content={
              <FormattedMessage
                id="shared-component.eto-overview.investment-stats.target.tooltip"
                values={{
                  lineBreak: <br />,
                  target: (
                    <WholeEur
                      data-test-id="investment-widget-nEur-original-target"
                      value={minInvestmentAmount.toString()}
                    />
                  ),
                }}
              />
            }
          />
        )}
      </span>
    </>
  );
};

export { InvestmentTarget };
