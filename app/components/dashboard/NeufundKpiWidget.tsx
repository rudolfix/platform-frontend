import * as React from "react";
import { Col, Row } from "reactstrap";
import { ChartBars } from "../shared/charts/ChartBars";
import { ChartPie } from "../shared/charts/ChartPie";
import { Money } from "../shared/Money";
import { PanelWhite } from "../shared/PanelWhite";
import * as styles from "./NeufundKpiWidget.module.scss";

const chartPieData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah"],
  datasets: [
    {
      data: [100, 50, 20, 40, 50, 12],
      backgroundColor: ["#394651", "#c4c5c6", "#616611", "#9fa914", "#d5e20f", "#0b0e11"],
    },
  ],
};

const chartBarData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah"],
  datasets: [
    {
      data: [100, 50, 20, 40, 50, 12],
      backgroundColor: ["#394651", "#c4c5c6", "#616611", "#9fa914", "#d5e20f", "#0b0e11"],
    },
  ],
};

export const NeufundKpiWidget = () => {
  return (
    <PanelWhite className={styles.neufundKpiWidget}>
      <div>
        <h3 className={styles.header}>
          Neufund kpi <time className={styles.date}>13. Feb 2018</time>
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
                <Money value={"2" + "0".repeat(26)} currency="eur" theme="t-green" />
                <Money value={"2" + "0".repeat(20)} currency="eth" />
              </div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>NEU Tokenholders</div>
              <div className={styles.value}>57</div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>
                Professional<br />Investors
              </div>
              <div className={styles.value}>6</div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>VC Accessible</div>
              <div className={styles.value}>
                <Money value={"2" + "0".repeat(20)} currency="eur" />
              </div>
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>NUMBER OF ETOs</div>
              <div className={styles.value} />
            </div>
            <div className={styles.listElement}>
              <div className={styles.label}>total capital deployed</div>
              <div className={styles.value}>
                <Money value={"2" + "0".repeat(20)} currency="eur" />
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
              <Money value={"2" + "0".repeat(26)} currency="eur" theme="t-green" />
            </h5>
            <ChartBars data={chartBarData} />
          </div>
        </Col>
      </Row>
    </PanelWhite>
  );
};
