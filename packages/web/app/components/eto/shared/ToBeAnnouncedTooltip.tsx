import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Tooltip } from "../../shared/tooltips/Tooltip";

import * as styles from "./ToBeAnnouncedTooltip.module.scss";

type TTooltipProps = React.ComponentProps<typeof Tooltip>;

const ToBeAnnounced: React.FunctionComponent = () => (
  <FormattedMessage id="eto.public-view.tba-tooltip" />
);

const ToBeAnnouncedTooltip: React.FunctionComponent<Partial<TTooltipProps>> = ({
  className,
  ...props
}) => (
  <Tooltip
    className={cn(className, styles.tooltip)}
    content={<FormattedMessage id="eto.public-view.tba-tooltip.content" />}
    {...props}
  >
    <ToBeAnnounced />
  </Tooltip>
);

export { ToBeAnnouncedTooltip, ToBeAnnounced };
