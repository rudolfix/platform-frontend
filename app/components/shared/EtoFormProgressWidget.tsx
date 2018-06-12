import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Link } from "react-router-dom";
import { ChartCircle, IChartCircleProps } from "./charts/ChartCircle";
import { InlineIcon } from "./InlineIcon";
import { Proportion } from "./Proportion";

import * as arrowRightIcon from "../../assets/img/inline_icons/arrow_right_light.svg";
import * as styles from "./EtoFormProgressWidget.module.scss";

interface IProps {
  to: string;
}

export const EtoFormProgressWidget: React.SFC<IProps & IChartCircleProps> = ({
  to,
  progress,
  name,
}) => {
  return (
    <Proportion className={styles.etoFormProgressWidget}>
      <ChartCircle progress={progress} name={name} />
      <Link to={to} className={styles.linkWrapper}>
        {progress < 1 ? (
          <FormattedMessage id="shared-component.eto-form-progress-widget.complete" />
        ) : (
          <FormattedMessage id="shared-component.eto-form-progress-widget.edit" />
        )}
        <InlineIcon svgIcon={arrowRightIcon} width="12px" height="12px" />
      </Link>
    </Proportion>
  );
};
