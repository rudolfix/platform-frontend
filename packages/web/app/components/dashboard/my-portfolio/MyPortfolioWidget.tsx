import * as React from "react";

import { EColumnSpan } from "../../layouts/Container";
import { PanelRounded } from "../../shared/Panel";
import { MyNeuWidget } from "./my-neu-widget/MyNeuWidget";
import { PortfolioStats } from "./PortfolioStats";

import * as styles from "./MyPortfolioWidget.module.scss";

export const MyPortfolioWidget: React.FunctionComponent = () => (
  <PanelRounded className={styles.myPortfolioWidget} columnSpan={EColumnSpan.TWO_COL}>
    <PortfolioStats />
    <MyNeuWidget />
  </PanelRounded>
);
