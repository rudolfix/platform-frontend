import { Eth, EurToken } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Tooltip } from "../../../../shared/tooltips/Tooltip";
import { ECustomTooltipTextPosition } from "../../../../shared/tooltips/TooltipBase";

type TExternalProps = {
  etherTokenBalance: string;
  euroTokenBalance: string;
};

type TTooltipProps = React.ComponentProps<typeof Tooltip>;

const FundraisingBreakdownTooltip: React.FunctionComponent<TExternalProps &
  Partial<TTooltipProps>> = ({ etherTokenBalance, euroTokenBalance, ...props }) => (
  <Tooltip
    textPosition={ECustomTooltipTextPosition.LEFT}
    content={
      <>
        <FormattedMessage id="shared-component.eto-overview.fundraising-breakdown" />
        <br />
        <EurToken value={euroTokenBalance} />
        <br />
        <Eth value={etherTokenBalance} />
      </>
    }
    {...props}
  />
);

export { FundraisingBreakdownTooltip };
