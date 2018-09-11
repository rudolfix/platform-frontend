import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { Button } from "./Buttons";
import { ChartCircle, IChartCircleProps } from "./charts/ChartCircle";
import { LoadingIndicator } from "./LoadingIndicator";
import { Panel } from "./Panel";
import { Proportion } from "./Proportion";

import * as arrowRightIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./EtoFormProgressWidget.module.scss";

interface IProps {
  to: string;
  isLoading: boolean;
  disabled: boolean;
  readonly: boolean;
}

interface IButtonTextProps {
  isInProgress: boolean;
  readonly: boolean;
}

const ButtonText: React.SFC<IButtonTextProps> = ({ isInProgress, readonly }) => {
  if (readonly) {
    return <FormattedMessage id="shared-component.eto-form-progress-widget.show" />;
  }

  if (isInProgress) {
    return <FormattedMessage id="shared-component.eto-form-progress-widget.complete" />;
  }

  return <FormattedMessage id="shared-component.eto-form-progress-widget.edit" />;
};

export const EtoFormProgressWidget: React.SFC<IProps & IChartCircleProps> = ({
  to,
  progress,
  name,
  isLoading,
  disabled,
  readonly,
}) => (
  <Panel>
    <Proportion width={100} height={108}>
      <div className={styles.contentWrapper}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <ChartCircle progress={progress} name={name} />

            <Link
              to={{
                pathname: to,
                state: { readonly },
              }}
              className={styles.linkWrapper}
              onClick={e => (disabled ? e.preventDefault() : e)}
            >
              <Button
                theme="silver"
                layout="secondary"
                iconPosition="icon-after"
                svgIcon={arrowRightIcon}
                disabled={disabled}
              >
                <ButtonText isInProgress={progress < 1} readonly={readonly} />
              </Button>
            </Link>
          </>
        )}
      </div>
    </Proportion>
  </Panel>
);
