import * as React from "react";
import { Col, Row } from "reactstrap";
import * as logo from "../../assets/img/logo_small_black.svg";
import { ChartBars, IChartBarsData } from "../shared/charts/ChartBars";
import { ChartPie, IChartPieData } from "../shared/charts/ChartPie";
import { Money, TCurrency } from "../shared/Money";
import { PanelWhite } from "../shared/PanelWhite";
import * as styles from "./NeufundKpiWidget.module.scss";

import { FormattedHTMLMessage, FormattedMessage } from "react-intl";
import { injectIntlHelpers } from "../../utils/injectIntlHelpers";
import { Button } from "../shared/Buttons";

interface IProps {
  date: string;
  tokenHolders: number;
  investorsNum: number;
  etosNum: number;
  vcAccessible: string;
  currency: TCurrency;
  totalCapitalDeployed: string;
  platformPortfolioValue: string;
  chartPieData: IChartPieData;
  chartBarData: IChartBarsData;
  totalProceeds: string;
  totalProceedsToken: string;
}

export const NeufundKpiWidget = injectIntlHelpers<IProps>(
  ({
    date,
    tokenHolders,
    investorsNum,
    etosNum,
    currency,
    totalCapitalDeployed,
    platformPortfolioValue,
    chartBarData,
    chartPieData,
    vcAccessible,
    totalProceeds,
    totalProceedsToken,
  }) => {
    return (
      <PanelWhite className={styles.neufundKpiWidget}>
        <div>
          <h3 className={styles.header}>
            <img src={logo} alt="neufund logo" />
            <FormattedMessage id="dashboard-neufundKpiWidget.header" />
            <time className={styles.date}>{date}</time>
          </h3>
        </div>
        <Row>
          <Col lg={6} xs={12}>
            <div className={styles.list}>
              <div className={styles.listElement}>
                <div className={styles.label}>
                  <FormattedHTMLMessage id="dashboard-neufundKpiWidget-list.label" />
                </div>
                <div className={styles.value}>
                  <Money value={totalProceeds} currency={currency} theme="t-green" />
                  <Money value={totalProceedsToken} currency="eth" />
                </div>
              </div>
              <div className={styles.listElement}>
                <div className={styles.label}>
                  <FormattedMessage id="dashboard-neufundKpiWidget.label2" />
                </div>
                <div className={styles.value}>{tokenHolders}</div>
              </div>
              <div className={styles.listElement}>
                <div className={styles.label}>
                  <FormattedHTMLMessage id="dashboard-neufundKpiWidget.label3" />
                </div>
                <div className={styles.value}>{investorsNum}</div>
              </div>
              <div className={styles.listElement}>
                <div className={styles.label}>
                  <FormattedMessage id="dashboard-neufundKpiWidget.label4" />
                </div>
                <div className={styles.value}>
                  <Money value={vcAccessible} currency={currency} />
                </div>
              </div>
              <div className={styles.listElement}>
                <div className={styles.label}>
                  <FormattedMessage id="dashboard-neufundKpiWidget.label5" />
                </div>
                <div className={styles.value}>{etosNum}</div>
              </div>
              <div className={styles.listElement}>
                <div className={styles.label}>
                  <FormattedMessage id="dashboard-neufundKpiWidget.label6" />
                </div>
                <div className={styles.value}>
                  <Money value={totalCapitalDeployed} currency="eur" />
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6} xs={12}>
            <div className={styles.pieWrapper}>
              <h4 className={styles.label}>
                <FormattedMessage id="dashboard-neufundKpiWidget-chart.title" />
              </h4>
              <ChartPie data={chartPieData} />
              <Button layout="secondary">
                <FormattedMessage id="dashboard-neufundKpiWidget-chart.button" />
              </Button>
            </div>
            <div className={styles.barWrapper}>
              <h4 className={styles.label}>
                <FormattedMessage id="dashboard-neufundKpiWidget-chart2.title" />
              </h4>
              <h5 className={styles.totalMoney}>
                <span className={styles.totalLabel}>
                  <FormattedMessage id="dashboard-neufundKpiWidget-chart2.label" />
                </span>
                <Money value={platformPortfolioValue} currency={currency} theme="t-green" />
              </h5>
              <ChartBars data={chartBarData} />
              <Button layout="secondary">
                <FormattedMessage id="dashboard-neufundKpiWidget-chart2.button" />
              </Button>
            </div>
          </Col>
        </Row>
      </PanelWhite>
    );
  },
);
