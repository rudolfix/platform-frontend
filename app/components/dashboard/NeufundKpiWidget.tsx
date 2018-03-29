import * as React from "react";
import { Col, Row } from "reactstrap";
import { ChartBars, IChartBarsData } from "../shared/charts/ChartBars";
import { ChartPie, IChartPieData } from "../shared/charts/ChartPie";
import { Money, TCurrency } from "../shared/Money";
import { PanelWhite } from "../shared/PanelWhite";
import * as styles from "./NeufundKpiWidget.module.scss";

import * as logo from "../../assets/img/logo_small_black.svg";

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

export const NeufundKpiWidget: React.SFC<IProps> = ({
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
  totalProceedsToken
}) => {
  return (
    <PanelWhite className={styles.neufundKpiWidget}>
      <div>
        <h3 className={styles.header}>
          <img src={logo} alt="neufund logo" /> Neufund kpi <time className={styles.date}>{ date }</time>
        </h3>
      </div>
      <Row>
        <Col lg={6} xs={12}>
          <div className={styles.list}>
            <div className={styles.listElement}>
              <div className={styles.label}>
                Total Proceeds<br />distributed to<br />NEU holders
              </div>
              <div className={styles.value}>
                <Money value={totalProceeds} currency={currency} theme="t-green" />
                <Money value={totalProceedsToken} currency="eth" />
              </div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>NEU Tokenholders</div>
              <div className={styles.value}>{ tokenHolders }</div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>
                Professional<br />Investors
              </div>
              <div className={styles.value}>{ investorsNum }</div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>VC Accessible</div>
              <div className={styles.value}>
                <Money value={vcAccessible} currency={ currency } />
              </div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>Number of ETOs</div>
              <div className={styles.value}>{ etosNum }</div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>total capital deployed</div>
              <div className={styles.value}>
                <Money value={totalCapitalDeployed} currency="eur" />
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} xs={12}>
          <div className={styles.pieWrapper}>
            <h4 className={styles.label}>NEU Distribution among token holders</h4>
            <ChartPie data={chartPieData} />
          </div>
          <div className={styles.barWrapper}>
            <h4 className={styles.label}>NEU - Platform Portfolio Value</h4>
            <h5 className={styles.totalMoney}>
              <span className={styles.totalLabel}>Total</span>
              <Money value={platformPortfolioValue} currency={currency} theme="t-green" />
            </h5>
            <ChartBars data={chartBarData} />
          </div>
        </Col>
      </Row>
    </PanelWhite>
  );
};
