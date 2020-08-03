import { etoModuleApi, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import { nonNullable } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import * as React from "react";

import { ProgressBarSimple } from "../../shared/ProgressBarSimple";

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

const InvestmentProgress: React.FunctionComponent<TExternalProps> = ({ eto }) => {
  const currentInvestmentProgressPercentage = nonNullable(
    etoModuleApi.utils.getInvestmentCalculatedPercentage(eto),
  );

  const progressBn = new BigNumber(currentInvestmentProgressPercentage);
  const progress = progressBn.greaterThan("100") ? "100" : progressBn.toString();

  return <ProgressBarSimple progress={progress} />;
};

export { InvestmentProgress };
