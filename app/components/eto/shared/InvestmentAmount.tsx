import * as React from "react";
import { ToHumanReadableForm } from "../../shared/ToHumanReadableForm";

type TExternalProps = {
  preMoneyValuationEur: number | undefined;
  existingCompanyShares: number | undefined;
  newSharesToIssue: number | undefined;
  minimumNewSharesToIssue: number | undefined;
};

const InvestmentAmount: React.SFC<TExternalProps> = ({
  preMoneyValuationEur = 1,
  existingCompanyShares = 1,
  newSharesToIssue = 1,
  minimumNewSharesToIssue = 1,
}) => {
  const minimumNewShares = (preMoneyValuationEur / existingCompanyShares) * minimumNewSharesToIssue;
  const newShares = (preMoneyValuationEur / existingCompanyShares) * newSharesToIssue;

  return (
    <ToHumanReadableForm number={minimumNewShares}>
      {divider => <ToHumanReadableForm number={newShares} divider={divider} />}
    </ToHumanReadableForm>
  );
};

export { InvestmentAmount };
