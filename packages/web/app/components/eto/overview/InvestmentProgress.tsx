import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { TTranslatedString } from "../../../types";
import { normalize } from "../../../utils/NumberUtils";
import { PercentageIndicatorBar, TProgressBarProps } from "../../shared/PercentageIndicatorBar";
import { getCurrentInvestmentProgressPercentage, getInvestmentCalculatedPercentage } from "./utils";

import * as styles from "./InvestmentProgress.module.scss";

type TProps = {
  eto: TEtoWithCompanyAndContract;
};

type TLabelExternalProps = {
  label: TTranslatedString;
  width: number;
  textAnchor?: "start" | "end" | "middle";
};

const Label: React.FunctionComponent<TLabelExternalProps> = ({
  label,
  width,
  textAnchor = "middle",
}) => (
  <text x={`${width}%`} y={30} textAnchor={textAnchor} className={styles.label}>
    {label}
  </text>
);

const InvestmentProgress: React.FunctionComponent<TProps> = ({ eto }) => {
  const calculatedPercentage = getInvestmentCalculatedPercentage(eto);
  const currentProgressPercentage = getCurrentInvestmentProgressPercentage(eto);

  const getNormalizedValue = normalize({ min: 0, max: calculatedPercentage });

  const successOfEtoNormalized = getNormalizedValue(100);
  const currentProgressOfEtoNormalized = getNormalizedValue(currentProgressPercentage);

  const progress: TProgressBarProps[] = [
    { progress: Math.ceil(currentProgressOfEtoNormalized * 100), theme: "green" },
  ];

  if (currentProgressOfEtoNormalized > successOfEtoNormalized) {
    progress.push({ progress: successOfEtoNormalized * 100, radius: 0 });
  }

  // replace by static message in case soft-cap was reached
  if (currentProgressPercentage >= 100) {
    return (
      <p className={styles.softCapReached}>
        <FormattedMessage id="shared-component.eto-overview.invest.min-amount-reached" />
      </p>
    );
  }

  return (
    <PercentageIndicatorBar
      className={styles.investmentProgress}
      layout="narrow"
      progress={progress}
      svgGroupStyle={{ transform: `translate(0 4)` }}
      svgHeight={40}
    >
      <rect x={`${successOfEtoNormalized * 100}%`} y={-6} className={cn(styles.successPoint)} />

      <Label
        label={<FormattedMessage id="shared-component.eto-overview.invest.min-amount" />}
        width={successOfEtoNormalized * 100}
      />
    </PercentageIndicatorBar>
  );
};

export { InvestmentProgress };
