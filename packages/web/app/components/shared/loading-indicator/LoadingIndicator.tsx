import { assertNever } from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { InlineIcon } from "../icons/InlineIcon";
import { LoadingIndicatorHexagon } from "./LoadingIndicatorHexagon";

import loadingSpinner from "../../../assets/img/inline_icons/loading_spinner.svg";
import spinning from "../../../assets/img/inline_icons/spinner.svg";
import * as styles from "./LoadingIndicator.module.scss";

export enum ELoadingIndicator {
  PULSE = "pulse",
  PULSE_WHITE = "pulse-white",
  BLOCKS = "blocks",
  HEXAGON = "hexagon",
  SPINNER = "spinner",
  SPINNER_SMALL = "spinner-small",
}

interface ILoadingIndicatorProps {
  light?: boolean;
  type?: ELoadingIndicator;
}

const LoadingIndicator: React.FunctionComponent<ILoadingIndicatorProps & CommonHtmlProps> = ({
  className,
  light,
  type = ELoadingIndicator.PULSE,
}) => {
  switch (type) {
    case ELoadingIndicator.PULSE:
    case ELoadingIndicator.PULSE_WHITE:
      return (
        <div
          data-test-id="loading-indicator-pulse"
          className={cn(className, styles.pulse, {
            [styles.pulseLight]: light,
            [styles.pulseWhite]: type === ELoadingIndicator.PULSE_WHITE,
          })}
        />
      );

    case ELoadingIndicator.BLOCKS:
      return (
        <div className={cn(className, styles.blocks)}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case ELoadingIndicator.SPINNER:
      return (
        <div className={cn(className, styles.spinner)}>
          <InlineIcon svgIcon={spinning} />
        </div>
      );
    case ELoadingIndicator.SPINNER_SMALL:
      return (
        <div className={cn(className, styles.spinnerSmall)}>
          <InlineIcon svgIcon={loadingSpinner} />
        </div>
      );
    case ELoadingIndicator.HEXAGON:
      return <LoadingIndicatorHexagon />;
    default:
      return assertNever(type, `Invalid loading indicator type "${type}"`);
  }
};

/**
 *  Wraps loading indicator in `Container` and set it to span all columns
 *  Useful to render loading indicator inside `WidgetGrid`.
 */
const LoadingIndicatorContainer: React.FunctionComponent<React.ComponentProps<
  typeof LoadingIndicator
>> = props => (
  <Container type={EContainerType.CONTAINER} columnSpan={EColumnSpan.THREE_COL}>
    <LoadingIndicator {...props} />
  </Container>
);

export { LoadingIndicator, LoadingIndicatorContainer };
