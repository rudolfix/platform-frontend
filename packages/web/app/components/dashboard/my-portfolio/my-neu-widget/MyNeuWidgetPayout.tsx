import * as React from "react";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import { MyNeuWidgetAvailablePayout } from "./MyNeuWidgetAvailablePayout";
import { MyNeuWidgetPendingPayoutLayout } from "./MyNeuWidgetPendingPayout";

type TExternalProps = {
  isPayoutAvailable: boolean;
  isPayoutPending: boolean;
  goToPortfolio: () => void;
} & React.ComponentProps<typeof MyNeuWidgetPendingPayoutLayout> &
  React.ComponentProps<typeof MyNeuWidgetAvailablePayout>;

const MyNeuWidgetPayout = compose<TExternalProps, TExternalProps>(
  branch<TExternalProps>(
    props => props.isPayoutAvailable,
    renderComponent(MyNeuWidgetAvailablePayout),
  ),
  branch<TExternalProps>(
    props => !props.isPayoutPending && !props.isPayoutAvailable,
    renderNothing,
  ),
  branch<TExternalProps>(props => !props.isPayoutPending, renderNothing),
)(MyNeuWidgetPendingPayoutLayout);

export { MyNeuWidgetPayout };
